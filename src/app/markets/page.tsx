import { MarketCard } from "@/components/market-card";
import { mockMarkets } from "@/lib/data";

export default function MarketsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Active Markets
        </h1>
        <p className="text-muted-foreground">
          Browse popular markets on Polymarket.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}
