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
  description: string;
  resolution_source: string;
  tags: string[];
};

export type Position = {
  market: string;
  user: string;
  net_quantity: string;
  avg_price: string;
  last_trade_time: string;
  liquidation_price: string | null;
  collateral: string;
  unrealized_pnl: string;
  realized_pnl: string;
  market_info: {
    question: string;
    image_url: string;
    category: string;
    outcomes: string[];
    end_date_iso: string;
    is_active: boolean;
    is_resolved: boolean;
    resolution: string | null;
    // Added market_info to match the actual API response
    market_info?: {
        category?: string;
    };
  }
};
