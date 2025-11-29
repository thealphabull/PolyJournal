import type { Trade } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Hourglass, BarChart, BrainCircuit } from "lucide-react";
import { AIThesisReview } from "@/components/ai-thesis-review";

type TradeCardProps = {
  trade: Trade;
};

function Stat({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

export function TradeCard({ trade }: TradeCardProps) {
  const isWin = trade.outcome === "win";
  const isLoss = trade.outcome === "loss";
  const isPending = trade.outcome === "pending";

  const pnlColor = isWin ? "text-green-500" : isLoss ? "text-red-500" : "text-muted-foreground";
  const PnlIcon = isWin ? TrendingUp : isLoss ? TrendingDown : Hourglass;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <CardTitle className="text-lg font-headline leading-tight">{trade.marketQuestion}</CardTitle>
          <Badge 
            variant={isWin ? "default" : isLoss ? "destructive" : "secondary"} 
            className={cn("capitalize w-fit h-fit", isWin && "bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30")}
          >
            {trade.outcome}
          </Badge>
        </div>
        <CardDescription>{new Date(trade.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
           <div className="flex items-start gap-2 text-sm">
             <PnlIcon className={cn("h-4 w-4 mt-0.5", pnlColor)} />
            <div>
              <p className="font-medium">PnL</p>
              <p className={cn("font-semibold text-base", pnlColor)}>
                {trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}
              </p>
            </div>
           </div>
          
           <div className="flex items-start gap-2 text-sm">
             <BarChart className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Position</p>
              <p className="text-base font-semibold text-foreground">
                {`$${trade.size.toFixed(2)} @ ${trade.entryPrice.toFixed(2)}c`}
              </p>
            </div>
           </div>

          <div className="flex items-start gap-2 text-sm">
            <BrainCircuit className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Conviction</p>
              <p className="text-base font-semibold text-foreground">{trade.conviction}/5</p>
            </div>
          </div>
        </div>

        <Separator />
        
        <div>
          <h4 className="mb-2 text-sm font-semibold">Thesis</h4>
          <p className="text-muted-foreground text-sm">{trade.thesis}</p>
        </div>

      </CardContent>
      <CardFooter className="bg-accent/30 py-3 px-6 justify-end">
        <AIThesisReview thesis={trade.thesis} />
      </CardFooter>
    </Card>
  );
}
