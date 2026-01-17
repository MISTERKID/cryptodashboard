export interface TickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

const BASE_URL = 'https://api.binance.com/api/v3';

const TRACKED_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
  'LINKUSDT', 'LTCUSDT'
];

export const SYMBOL_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  BNBUSDT: 'BNB',
  SOLUSDT: 'Solana',
  XRPUSDT: 'XRP',
  ADAUSDT: 'Cardano',
  DOGEUSDT: 'Dogecoin',
  AVAXUSDT: 'Avalanche',
  DOTUSDT: 'Polkadot',
  MATICUSDT: 'Polygon',
  LINKUSDT: 'Chainlink',
  LTCUSDT: 'Litecoin',
};

export const SYMBOL_ICONS: Record<string, string> = {
  BTCUSDT: '₿',
  ETHUSDT: 'Ξ',
  BNBUSDT: '◈',
  SOLUSDT: '◎',
  XRPUSDT: '✕',
  ADAUSDT: '₳',
  DOGEUSDT: 'Ð',
  AVAXUSDT: '▲',
  DOTUSDT: '●',
  MATICUSDT: '⬡',
  LINKUSDT: '⬢',
  LTCUSDT: 'Ł',
};

export async function fetch24hrTickers(): Promise<TickerData[]> {
  const response = await fetch(`${BASE_URL}/ticker/24hr`);
  if (!response.ok) throw new Error('Failed to fetch tickers');
  
  const data: TickerData[] = await response.json();
  return data.filter(ticker => TRACKED_SYMBOLS.includes(ticker.symbol));
}

export async function fetchKlines(symbol: string, interval = '1h', limit = 24): Promise<KlineData[]> {
  const response = await fetch(
    `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!response.ok) throw new Error('Failed to fetch klines');
  
  const data = await response.json();
  return data.map((k: any[]) => ({
    openTime: k[0],
    open: k[1],
    high: k[2],
    low: k[3],
    close: k[4],
    volume: k[5],
    closeTime: k[6],
  }));
}

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(2);
  if (num >= 0.01) return num.toFixed(4);
  return num.toFixed(6);
}

export function formatVolume(volume: string | number): string {
  const num = typeof volume === 'string' ? parseFloat(volume) : volume;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatPercent(percent: string | number): string {
  const num = typeof percent === 'string' ? parseFloat(percent) : percent;
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}
