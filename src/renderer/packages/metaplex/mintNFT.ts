import {
  createAssociatedTokenAccountInstruction,
  createMasterEdition,
  createMetadata,
  createMint,
  Creator,
  Data,
  ENV,
  programIds,
  sendTransactionWithRetry,
  updateMetadata,
} from "@oyster/common";
import { BN } from "@project-serum/anchor";
import { AccountLayout, MintLayout, Token } from "@solana/spl-token";
import { WalletAdapter } from "@solana/wallet-base";
// import { WalletAdapter } from '@solana/wallet-base';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import crypto from "crypto";
import { getAssetCostToStore } from "./getAssetCostToStore";
import { AR_SOL_HOLDER_ID } from "./ids";

const RESERVED_TXN_MANIFEST = "manifest.json";

interface IArweaveResult {
  error?: string;
  messages?: Array<{
    filename: string;
    status: "success" | "fail";
    transactionId?: string;
    error?: string;
  }>;
}

export const mintNFT = async (
  connection: Connection,
  wallet: WalletAdapter | undefined,
  env: ENV,
  files: File[],
  metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string | undefined;
    external_url: string;
    properties: any;
    creators: Creator[] | null;
    sellerFeeBasisPoints: number;
  },
  maxSupply?: number
): Promise<{
  metadataAccount: PublicKey;
} | void> => {
  if (!wallet?.publicKey) {
    return;
  }
  const realFiles: File[] = [
    ...files,
    new File(
      [
        JSON.stringify({
          name: metadata.name,
          symbol: metadata.symbol,
          description: metadata.description,
          seller_fee_basis_points: metadata.sellerFeeBasisPoints,
          image: metadata.image,
          external_url: metadata.external_url,
          properties: {
            ...metadata.properties,
            creators: metadata.creators?.map((creator) => {
              return {
                address: creator.address.toBase58(),
                verified: creator.verified,
                share: creator.share,
              };
            }),
          },
        }),
      ],
      "metadata.json"
    ),
  ];

  const { instructions: pushInstructions, signers: pushSigners } =
    await prepPayForFilesTxn(wallet, realFiles);

  const TOKEN_PROGRAM_ID = programIds().token;

  // Allocate memory for the account
  const mintRent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );
  const accountRent = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );

  // This owner is a temporary signer and owner of metadata we use to circumvent requesting signing
  // twice post Arweave. We store in an account (payer) and use it post-Arweave to update MD with new link
  // then give control back to the user.
  // const payer = new Account();
  const payerPublicKey = wallet.publicKey;
  const instructions: TransactionInstruction[] = [...pushInstructions];
  const signers: Keypair[] = [...pushSigners];

  // This is only temporarily owned by wallet...transferred to program by createMasterEdition below
  const mintKey = createMint(
    instructions,
    wallet.publicKey,
    mintRent,
    0,
    // Some weird bug with phantom where it's public key doesnt mesh with data encode wellff
    payerPublicKey,
    payerPublicKey,
    signers
  );

  const recipientKey: PublicKey = (
    await PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        programIds().token.toBuffer(),
        mintKey.toBuffer(),
      ],
      programIds().associatedToken
    )
  )[0];

  createAssociatedTokenAccountInstruction(
    instructions,
    recipientKey,
    wallet.publicKey,
    wallet.publicKey,
    mintKey
  );

  instructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mintKey,
      recipientKey,
      payerPublicKey,
      [],
      1
    )
  );

  const metadataAccount = await createMetadata(
    new Data({
      symbol: metadata.symbol,
      name: metadata.name,
      uri: `https://-------.---/rfX69WKd7Bin_RTbcnH4wM3BuWWsR_ZhWSSqZBLYdMY`,
      sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      creators: metadata.creators,
    }),
    payerPublicKey,
    mintKey,
    payerPublicKey,
    instructions,
    wallet.publicKey
  );

  // TODO: enable when using payer account to avoid 2nd popup
  // const block = await connection.getRecentBlockhash('singleGossip');
  // instructions.push(
  //   SystemProgram.transfer({
  //     fromPubkey: wallet.publicKey,
  //     toPubkey: payerPublicKey,
  //     lamports: 0.5 * LAMPORTS_PER_SOL // block.feeCalculator.lamportsPerSignature * 3 + mintRent, // TODO
  //   }),
  // );

  const { txid } = await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    signers
  );

  try {
    await connection.confirmTransaction(txid, "max");
  } catch {
    // ignore
  }

  // Force wait for max confirmations
  // await connection.confirmTransaction(txid, 'max');
  await connection.getParsedConfirmedTransaction(txid, "confirmed");

  // this means we're done getting AR txn setup. Ship it off to ARWeave!
  const data = new FormData();

  const tags = realFiles.reduce(
    (acc: Record<string, Array<{ name: string; value: string }>>, f) => {
      acc[f.name] = [{ name: "mint", value: mintKey.toBase58() }];
      return acc;
    },
    {}
  );
  data.append("tags", JSON.stringify(tags));
  data.append("transaction", txid);
  realFiles.map((f) => data.append("file[]", f));

  // TODO: convert to absolute file name for image

  const result: IArweaveResult = await (
    await fetch(
      // TODO: add CNAME
      env === "mainnet-beta"
        ? "https://us-central1-principal-lane-200702.cloudfunctions.net/uploadFileProd-1"
        : "https://us-central1-principal-lane-200702.cloudfunctions.net/uploadFile-1",
      {
        method: "POST",
        body: data,
      }
    )
  ).json();

  const metadataFile = result.messages?.find(
    (m) => m.filename === RESERVED_TXN_MANIFEST
  );
  if (metadataFile?.transactionId && wallet.publicKey) {
    const updateInstructions: TransactionInstruction[] = [];
    const updateSigners: Keypair[] = [];

    // TODO: connect to testnet arweave
    const arweaveLink = `https://arweave.net/${metadataFile.transactionId}`;
    await updateMetadata(
      new Data({
        name: metadata.name,
        symbol: metadata.symbol,
        uri: arweaveLink,
        creators: metadata.creators,
        sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      }),
      undefined,
      undefined,
      mintKey,
      payerPublicKey,
      updateInstructions,
      metadataAccount
    );

    // // This mint, which allows limited editions to be made, stays with user's wallet.
    const printingMint = createMint(
      updateInstructions,
      payerPublicKey,
      mintRent,
      0,
      payerPublicKey,
      payerPublicKey,
      updateSigners
    );

    const oneTimePrintingAuthorizationMint = createMint(
      updateInstructions,
      payerPublicKey,
      mintRent,
      0,
      payerPublicKey,
      payerPublicKey,
      updateSigners
    );

    if (maxSupply !== undefined) {
      // make this so we can use it later.
      const authTokenAccount: PublicKey = (
        await PublicKey.findProgramAddress(
          [
            wallet.publicKey.toBuffer(),
            programIds().token.toBuffer(),
            printingMint.toBuffer(),
          ],
          programIds().associatedToken
        )
      )[0];
      createAssociatedTokenAccountInstruction(
        instructions,
        authTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        printingMint
      );
    }
    // // In this instruction, mint authority will be removed from the main mint, while
    // // minting authority will be maintained for the Printing mint (which we want.)
    await createMasterEdition(
      maxSupply ? new BN(maxSupply) : (undefined as any),
      mintKey,
      printingMint,
      oneTimePrintingAuthorizationMint,
      payerPublicKey,
      payerPublicKey,
      updateInstructions,
      payerPublicKey,
      payerPublicKey,
      maxSupply ? payerPublicKey : undefined
    );
    // TODO: enable when using payer account to avoid 2nd popup
    /*  if (maxSupply !== undefined)
      updateInstructions.push(
        setAuthority({
          target: authTokenAccount,
          currentAuthority: payerPublicKey,
          newAuthority: wallet.publicKey,
          authorityType: 'AccountOwner',
        }),
      );
*/
    // TODO: enable when using payer account to avoid 2nd popup
    // Note with refactoring this needs to switch to the updateMetadataAccount command
    // await transferUpdateAuthority(
    //   metadataAccount,
    //   payerPublicKey,
    //   wallet.publicKey,
    //   updateInstructions,
    // );

    const txid = await sendTransactionWithRetry(
      connection,
      wallet,
      updateInstructions,
      updateSigners
    );

    // notify({
    //   message: 'Art created on Solana',
    //   description: (
    //     <a href={arweaveLink} target="_blank">
    //       Arweave Link
    //     </a>
    //   ),
    //   type: 'success',
    // });

    // TODO: refund funds
    // send transfer back to user
  }

  return { metadataAccount };
};

const prepPayForFilesTxn = async (
  wallet: WalletAdapter,
  files: File[]
): Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
}> => {
  const memo = programIds().memo;

  const instructions: TransactionInstruction[] = [];
  const signers: Keypair[] = [];

  if (wallet.publicKey)
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: AR_SOL_HOLDER_ID,
        lamports: await getAssetCostToStore(files),
      })
    );

  for (let i = 0; i < files.length; i++) {
    const hashSum = crypto.createHash("sha256");
    hashSum.update(await files[i].text());
    const hex = hashSum.digest("hex");
    instructions.push(
      new TransactionInstruction({
        keys: [],
        programId: memo,
        data: Buffer.from(hex),
      })
    );
  }

  return {
    instructions,
    signers,
  };
};
