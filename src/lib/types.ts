export type TradeOutcome = "win" | "loss" | "pending";

export type Trade = {
  id: string;
  marketQuestion: string;
  marketCategory: string;
  entryPrice: number;
  size: number;
  pnl: number;
  outcome: TradeOutcome;
  thesis: string;
  date: string;
  conviction: number;
  holdDurationHours: number;
};

export type Market = {
  id: string;
  question: string;
  category: string;
  liquidity: number;
  volume: number;
  outcomes: {
    name: string;
    price: number;
  }[];
  endDate: string;
};
