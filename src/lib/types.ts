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
  slug: string;
  category: string;
  active: boolean;
  liquidity: number;
  volume: number;
  outcome_prices: string[];
  end_date_iso: string;
};
