import type { Market } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type MarketCardProps = {
  market: Market;
};

export function MarketCard({ market }: MarketCardProps) {
    const timeRemaining = formatDistanceToNow(new Date(market.end_date_iso), { addSuffix: true });
    const referralLink = `https://polymarket.com/event/${market.slug}?via=recktinomics`;

    const outcomes = [
        { name: 'Yes', price: parseFloat(market.outcome_prices[1]) },
        { name: 'No', price: parseFloat(market.outcome_prices[0]) }
    ].sort((a, b) => b.price - a.price);

  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-headline leading-tight">
            {market.question}
          </CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">{market.category}</Badge>
        </div>
        <CardDescription>
          Closes {timeRemaining}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-center text-center">
            {outcomes.map(outcome => (
                 <div key={outcome.name} className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">{outcome.name}</span>
                    <span className="text-2xl font-bold text-primary">{Math.round(outcome.price * 100)}c</span>
                 </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground bg-accent/30 py-3 px-6">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Liquidity">
                <TrendingUp className="h-4 w-4" />
                <span>${(market.liquidity / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-center gap-1.5" title="Volume">
                <Users className="h-4 w-4" />
                <span>${(market.volume / 1000).toFixed(0)}k</span>
            </div>
        </div>
        <Button variant="ghost" size="sm" className="h-auto px-2 py-1" asChild>
          <Link href={referralLink} target="_blank" rel="noopener noreferrer">
            Trade
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
