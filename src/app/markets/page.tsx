import { MarketCard } from "@/components/market-card";
import type { Market } from "@/lib/types";

async function getActiveMarkets(): Promise<Market[]> {
  try {
    const response = await fetch('https://clob.polymarket.com/markets', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!response.ok) {
      throw new Error('Failed to fetch markets');
    }
    const markets: Market[] = await response.json();
    
    return markets
      .filter(market => market.active === true)
      .sort((a, b) => b.volume - a.volume);

  } catch (error) {
    console.error("Error fetching active markets:", error);
    return [];
  }
}

export default async function MarketsPage() {
  const activeMarkets = await getActiveMarkets();

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
      {activeMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Could not load markets. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
