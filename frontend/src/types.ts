export interface Order {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: string;
  timestamp: string;
}

export type PriceMap = Record<string, number>;

export interface StockData {
  current: number;
  previous: number;
  open: number;
}

// NEW: This will be our main state for stocks
// e.g., { "AAPL": { current: 150.25, previous: 150.00 } }
export type StockMap = Record<string, StockData>;

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export type HistoryPoint = {
  date: string; // ISO string (required)
  time?: string; // friendly time (optional)
  [symbol: string]: any; // stock symbols -> numbers
};
