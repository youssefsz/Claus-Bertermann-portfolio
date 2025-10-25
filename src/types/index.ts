export type Language = 'en' | 'nl';

export interface Artwork {
  id: string;
  title: string;
  dimensions: string;
  medium: string;
  image: string;
  price?: string;
  auctionHouse?: string;
}

export interface PressItem {
  id: string;
  title: string;
  source: string;
  date: string;
  link?: string;
}
