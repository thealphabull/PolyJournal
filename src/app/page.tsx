import { TradeCard } from "@/components/trade-card";
import { mockTrades } from "@/lib/data";
import type { Trade } from "@/lib/types";

export default function TradeTimelinePage() {
  const trades = mockTrades as Trade[];

  return (
    <div className="container mx-auto">
      <h1 className="mb-8 text-3xl font-bold font-headline tracking-tight">
        Trade Timeline
      </h1>
      <div className="flex flex-col gap-6">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>
    </div>
  );
}
