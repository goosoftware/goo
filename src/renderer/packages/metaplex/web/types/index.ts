import { MetadataCategory } from "../../common";

export interface Auction {
  name: string;
  auctionerName: string;
  auctionerLink: string;
  highestBid: number;
  solAmt: number;
  link: string;
  image: string;

  endingTS: number;
}

export interface Artist {
  address?: string;
  name: string;
  link: string;
  image: string;
  itemsAvailable?: number;
  itemsSold?: number;
  about?: string;
  verified?: boolean;

  share?: number;
}

export enum ArtType {
  Master,
  Print,
  NFT,
}
export interface Art {
  image: string;
  uri: string | undefined;
  mint: string | undefined;
  category: MetadataCategory;
  link: string;
  title: string;
  artist: string;
  priceSOL: number;
  endingTS?: number;
  seller_fee_basis_points?: number;
  creators?: Artist[];
  about?: string;
  type: ArtType;
  edition?: number;
  supply?: number;
  maxSupply?: number;
  files?: string[];
}

export interface Presale {
  endingTS: number;
  targetPricePerShare?: number;
  pricePerShare?: number;
  marketCap?: number;
}
