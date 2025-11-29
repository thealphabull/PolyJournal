"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, AlertTriangle } from "lucide-react";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PnlChart } from "@/components/dashboard/pnl-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Trade, Position } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

export const maxDuration = 30;

// This function now transforms live Position data into the app's Trade format
const transformPositionsToTrades = (positions: Position[], address: string): Trade[] => {
  return positions.map((pos, index) => {
    const pnl = parseFloat(pos.unrealized_pnl) + parseFloat(pos.realized_pnl);
    const outcome = pos.market_info.is_resolved
      ? pnl > 0 ? 'win' : 'loss'
      : 'pending';
    
    return {
      id: `${pos.market}-${index}`,
      marketQuestion: pos.market_info.question,
      marketCategory: pos.market_info.category ?? 'Unknown',
      entryPrice: parseFloat(pos.avg_price),
      size: parseFloat(pos.collateral),
      pnl: pnl,
      outcome: outcome,
      thesis: "This is a live trade imported from your wallet. You can edit the thesis here.", // Default thesis
      date: pos.last_trade_time,
      conviction: 3, // Default conviction
      holdDurationHours: 0, // This would require more complex calculation
    };
  });
};


async function getUserPositions(address: string | undefined): Promise<Position[]> {
  if (!address) return [];
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`https://data-api.polymarket.com/positions?user=${address}`, {
        headers: {
            'User-Agent': 'PolyJournal (NextJS/Vercel Client)',
        }
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data as Position[];
    } catch (error) {
      console.error(`Error fetching user positions (attempt ${i + 1}/${MAX_RETRIES}):`, error);
      if (i === MAX_RETRIES - 1) {
        throw error;
      }
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  return [];
}


export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true);
      setError(null);
      getUserPositions(address)
        .then(positions => {
          const liveTrades = transformPositionsToTrades(positions, address);
          setTrades(liveTrades);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch your trading data from the Polymarket API. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [address, isConnected]);


  if (!isConnected) {
    return (
      <div className="container mx-auto text-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connect Your Wallet</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your personalized dashboard and trade history.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  if (isLoading) {
    return (
        <div className="container mx-auto flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading your trading dashboard...</p>
        </div>
    )
  }

  if (error) {
     return (
        <div className="container mx-auto text-center">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
     )
  }


  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={trades.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button asChild variant="default">
            <Link href="/dashboard/trades">View Trade Journal</Link>
          </Button>
        </div>
      </div>
      
      <StatsGrid trades={trades} />

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {trades.length > 0 ? (
                <PnlChart trades={trades} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <p>No trading data available to display chart.</p>
                    <p className="text-sm">Once you have closed trades, your PnL will appear here.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
