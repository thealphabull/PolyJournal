import { MarketCard } from "@/components/market-card";
import type { Market } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

async function getActiveMarkets(): Promise<Market[]> {
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch('https://clob.polymarket.com/markets', {
        next: { revalidate: 60 } // Revalidate every 60 seconds
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const markets: Market[] = await response.json();
      
      // Filter for active markets and sort by volume client-side
      return markets
        .filter(market => market.active === true)
        .sort((a, b) => b.volume - a.volume);

    } catch (error) {
      console.error(`Error fetching active markets (attempt ${i + 1}/${MAX_RETRIES}):`, error);
      if (i === MAX_RETRIES - 1) {
        // If it's the last retry, re-throw the error to be caught by the page
         throw error;
      }
      // Wait a bit before retrying
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  return []; // Should not be reached, but satisfies TypeScript
}

export default async function MarketsPage() {
  let activeMarkets: Market[] = [];
  let error: Error | null = null;

  try {
    activeMarkets = await getActiveMarkets();
  } catch (e) {
    error = e as Error;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Active Markets
        </h1>
        <p className="text-muted-foreground">
          Browse popular markets on Polymarket, sorted by trading volume.
        </p>
      </div>
      {error ? (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Markets</AlertTitle>
            <AlertDescription>
                Could not load markets from the Polymarket API after several attempts. The service may be temporarily unavailable. Please try again later.
            </AlertDescription>
        </Alert>
      ) : activeMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
         <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No active markets found at the moment.</p>
        </div>
      )}
    </div>
  );
}
