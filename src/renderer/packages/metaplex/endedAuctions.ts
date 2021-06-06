import { Connection, PublicKey } from "@solana/web3.js";
import { setProgramIds } from "./common";
import {
  processAuctions,
  processMetaData,
  processMetaplexAccounts,
  processVaultData,
} from "./web/contexts/meta";
import {
  AuctionViewState,
  processAccountsIntoAuctionView,
} from "./web/hooks/useAuctions";

let STORE: PublicKey;

const connection = new Connection("https://api.devnet.solana.com");

export const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);
export let TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export let SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
export let BPF_UPGRADE_LOADER_ID = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const MEMO_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export const VAULT_ID = new PublicKey(
  "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn"
);

export const AUCTION_ID = new PublicKey(
  "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8"
);

export const METAPLEX_ID = new PublicKey(
  "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
);

export let SYSTEM = new PublicKey("11111111111111111111111111111111");

const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
    associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
    system: SYSTEM,
    metadata: METADATA_PROGRAM_ID,
    memo: MEMO_ID,
    vault: VAULT_ID,
    auction: AUCTION_ID,
    metaplex: METAPLEX_ID,
    store: STORE,
  };
};

const getAccounts = async (state = AuctionViewState.Live, env = "devnet") => {
  const accounts = (
    await Promise.all([
      connection.getProgramAccounts(programIds().vault),
      connection.getProgramAccounts(programIds().auction),
      connection.getProgramAccounts(programIds().metadata),
      connection.getProgramAccounts(programIds().metaplex),
    ])
  ).flat();

  await setProgramIds(env);

  const tempCache = {
    metadata: {},
    metadataByMint: {},
    masterEditions: {},
    masterEditionsByPrintingMint: {},
    masterEditionsByOneTimeAuthMint: {},
    metadataByMasterEdition: {},
    editions: {},
    auctionManagersByAuction: {},
    bidRedemptions: {},
    auctions: {},
    vaults: {},
    payoutTickets: {},
    store: {},
    whitelistedCreatorsByCreator: {},
    bidderMetadataByAuctionAndBidder: {},
    bidderPotsByAuctionAndBidder: {},
    safetyDepositBoxesByVaultAndIndex: {},
  };

  for (let i = 0; i < accounts.length; i++) {
    processVaultData(
      accounts[i],
      (cb: any) =>
        (tempCache.safetyDepositBoxesByVaultAndIndex = cb(
          tempCache.safetyDepositBoxesByVaultAndIndex
        )),
      (cb: any) => (tempCache.vaults = cb(tempCache.vaults))
    );

    processAuctions(
      accounts[i],
      (cb: any) => (tempCache.auctions = cb(tempCache.auctions)),
      (cb: any) =>
        (tempCache.bidderMetadataByAuctionAndBidder = cb(
          tempCache.bidderMetadataByAuctionAndBidder
        )),
      (cb: any) =>
        (tempCache.bidderPotsByAuctionAndBidder = cb(
          tempCache.bidderPotsByAuctionAndBidder
        ))
    );

    await processMetaData(
      accounts[i],
      (cb: any) => (tempCache.metadataByMint = cb(tempCache.metadataByMint)),
      (cb: any) =>
        (tempCache.metadataByMasterEdition = cb(
          tempCache.metadataByMasterEdition
        )),
      (cb: any) => (tempCache.editions = cb(tempCache.editions)),
      (cb: any) => (tempCache.masterEditions = cb(tempCache.masterEditions)),
      (cb: any) =>
        (tempCache.masterEditionsByPrintingMint = cb(
          tempCache.masterEditionsByPrintingMint
        )),
      (cb: any) =>
        (tempCache.masterEditionsByOneTimeAuthMint = cb(
          tempCache.masterEditionsByOneTimeAuthMint
        ))
    );

    await processMetaplexAccounts(
      accounts[i],
      (cb: any) =>
        (tempCache.auctionManagersByAuction = cb(
          tempCache.auctionManagersByAuction
        )),
      (cb: any) => (tempCache.bidRedemptions = cb(tempCache.bidRedemptions)),
      (cb: any) => (tempCache.payoutTickets = cb(tempCache.payoutTickets)),
      (obj: any) => (tempCache.store = obj),
      (cb: any) =>
        (tempCache.whitelistedCreatorsByCreator = cb(
          tempCache.whitelistedCreatorsByCreator
        ))
    );
  }

  const {
    auctions,
    auctionManagersByAuction,
    safetyDepositBoxesByVaultAndIndex,
    metadataByMint,
    bidderMetadataByAuctionAndBidder,
    bidderPotsByAuctionAndBidder,
    vaults,
    masterEditions,
    masterEditionsByPrintingMint,
    masterEditionsByOneTimeAuthMint,
    metadataByMasterEdition,
  } = tempCache;

  const auctionViews = {};

  Object.keys(auctions).forEach((a) => {
    const auction = auctions[a];
    const existingAuctionView = auctionViews[a];
    const nextAuctionView = processAccountsIntoAuctionView(
      //pubkey,
      null,
      auction,
      auctionManagersByAuction,
      safetyDepositBoxesByVaultAndIndex,
      metadataByMint,
      bidderMetadataByAuctionAndBidder,
      bidderPotsByAuctionAndBidder,
      masterEditions,
      vaults,
      masterEditionsByPrintingMint,
      masterEditionsByOneTimeAuthMint,
      metadataByMasterEdition,
      // cachedRedemptionKeys,
      {},
      state,
      existingAuctionView
    );
    if (nextAuctionView) {
      auctionViews[a] = nextAuctionView;
    }
  });

  return auctionViews;
};

getAccounts().then(console.log);
