import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { serialize } from "borsh";
import { ClaimBidArgs, getAuctionKeys, SCHEMA } from ".";
import { getBidderPotKey, programIds } from "../../../common";

export async function claimBid(
  acceptPayment: PublicKey,
  bidder: PublicKey,
  bidderPotToken: PublicKey,
  vault: PublicKey,
  tokenMint: PublicKey,
  instructions: TransactionInstruction[]
) {
  const PROGRAM_IDS = programIds();

  const { auctionKey, auctionManagerKey } = await getAuctionKeys(vault);

  const bidderPotKey = await getBidderPotKey({
    auctionProgramId: PROGRAM_IDS.auction,
    auctionKey,
    bidderPubkey: bidder,
  });

  const value = new ClaimBidArgs();
  const data = Buffer.from(serialize(SCHEMA, value));

  const keys = [
    {
      pubkey: acceptPayment,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: bidderPotToken,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: bidderPotKey,
      isSigner: false,
      isWritable: true,
    },

    {
      pubkey: auctionManagerKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: auctionKey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: bidder,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: tokenMint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: vault,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: PROGRAM_IDS.store,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: PROGRAM_IDS.auction,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: PROGRAM_IDS.token,
      isSigner: false,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: PROGRAM_IDS.metaplex,
      data,
    })
  );
}
