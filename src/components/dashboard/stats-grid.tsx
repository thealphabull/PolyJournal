import type { Trade } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, BarChart, BrainCircuit, CheckCircle, Percent, XCircle, Scale } from "lucide-react";

type StatsGridProps = {
  trades: Trade[];
};

function StatCard({ title, value, icon: Icon, valueClass, helpText }: { title: string, value: string, icon: React.ElementType, valueClass?: string, helpText?: string }) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
        {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      </CardContent>
    </Card>
  )
}

export function StatsGrid({ trades }: StatsGridProps) {
  const closedTrades = trades.filter((t) => t.outcome !== "pending");
  const totalPnl = trades.reduce((acc, trade) => acc + trade.pnl, 0); // Sum of both realized and unrealized pnl
  const totalWins = closedTrades.filter((t) => t.outcome === "win").length;
  const winRate = closedTrades.length > 0 ? (totalWins / closedTrades.length) * 100 : 0;
  const totalVolume = trades.reduce((acc, trade) => acc + trade.size, 0);
  
  // Avg conviction is now based on default unless user edits it
  const avgConviction = trades.length > 0 ? trades.reduce((acc, t) => acc + t.conviction, 0) / trades.length : 0;
  
  const pnlClass = totalPnl >= 0 ? "text-green-500" : "text-red-500";
  const PnlIcon = totalPnl >= 0 ? ArrowUp : ArrowDown;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
            title="Total PnL"
            value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Scale}
            valueClass={pnlClass}
            helpText="Unrealized + Realized PnL"
        />
        <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            icon={Percent}
            helpText={closedTrades.length > 0 ? `${totalWins} wins / ${closedTrades.length} resolved trades` : 'No resolved trades yet'}
        />
        <StatCard
            title="Total Position Value"
            value={`$${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={BarChart}
            helpText="Current value of all positions"
        />
        <StatCard
            title="Avg. Conviction"
            value={trades.length > 0 ? `${avgConviction.toFixed(2)} / 5` : 'N/A'}
            icon={BrainCircuit}
            helpText="Your average conviction score per trade"
        />
    </div>
  );
}
