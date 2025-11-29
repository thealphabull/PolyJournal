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
