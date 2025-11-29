"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { TradeCard } from "@/components/trade-card";
import type { Trade, Position } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const transformPositionsToTrades = (positions: Position[]): Trade[] => {
  return positions.map((pos, index) => {
    const pnl = parseFloat(pos.unrealized_pnl) + parseFloat(pos.realized_pnl);
    const outcome = pos.market_info.is_resolved
      ? pnl > 0 ? 'win' : 'loss'
      : 'pending';

    return {
      id: `${pos.market}-${index}`,
      marketQuestion: pos.market_info.question,
      marketCategory: pos.market_info.market_info?.category ?? 'Unknown',
      entryPrice: parseFloat(pos.avg_price),
      size: parseFloat(pos.collateral),
      pnl,
      outcome,
      thesis: "This is a live trade imported from your wallet. You can edit the thesis here.",
      date: pos.last_trade_time,
      conviction: 3,
      holdDurationHours: 0,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

async function getUserPositions(address: string | undefined): Promise<Position[]> {
  if (!address) return [];
  const response = await fetch(`https://clob.polymarket.com/positions/${address}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user positions');
  }
  const data = await response.json();
  return data.positions as Position[];
}

export default function TradeJournalPage() {
  const { address, isConnected } = useAccount();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "win" | "loss" | "pending">("all");

  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true);
      setError(null);
      getUserPositions(address)
        .then(positions => {
          const liveTrades = transformPositionsToTrades(positions);
          setTrades(liveTrades);
          setFilteredTrades(liveTrades);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch your trade history.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTrades(trades);
    } else {
      setFilteredTrades(trades.filter(trade => trade.outcome === filter));
    }
  }, [filter, trades]);


  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Trade Journal
        </h1>
        <div className="w-full md:w-48">
            <Select onValueChange={(value: "all" | "win" | "loss" | "pending") => setFilter(value)} defaultValue="all">
                <SelectTrigger>
                    <SelectValue placeholder="Filter trades" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Trades</SelectItem>
                    <SelectItem value="win">Wins</SelectItem>
                    <SelectItem value="loss">Losses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {!isConnected ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connect Your Wallet</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your trade journal.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading your trades...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredTrades.length > 0 ? (
        <div className="space-y-6">
          {filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h3 className="text-xl font-semibold">No Trades Found</h3>
            <p className="text-muted-foreground mt-2">
                {filter === 'all' ? "You don't have any trades yet." : `You don't have any ${filter} trades.`}
            </p>
        </div>
      )}
    </div>
  );
}
