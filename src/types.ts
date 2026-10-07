export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface IndexItem {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  badge?: string;
  badgeColor?: string;
  sparkline: number[];
}

export interface WorldIndexItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  isUp: boolean;
  country: string;
  sparkline: number[];
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: string;
  rawVolume: number;
  marketCap: string;
  peRatio?: number;
  high52: number;
  low52: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  logoUrl?: string;
  logoInitials: string;
  sparkline: number[];
  sector?: string;
  description?: string;
}

export interface EarningsEvent {
  id: string;
  symbol: string;
  name: string;
  act: number | string;
  est: number | string;
  date: string;
  status: 'surpassed' | 'missed' | 'pending';
  period: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
  time: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  snippet: string;
  category: string;
  url: string;
}
