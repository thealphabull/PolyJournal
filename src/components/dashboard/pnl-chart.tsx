"use client";

import type { Trade } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";

type PnlChartProps = {
  trades: Trade[];
};

export function PnlChart({ trades }: PnlChartProps) {
  const chartData = useMemo(() => {
    const closedTrades = trades.filter((t) => t.outcome !== "pending");
    if (closedTrades.length === 0) return [];
    
    const sortedTrades = [...closedTrades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativePnl = 0;
    const data = sortedTrades.map((trade) => {
      cumulativePnl += trade.pnl;
      return {
        date: new Date(trade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        pnl: cumulativePnl,
      };
    });

    return [{ date: "Start", pnl: 0 }, ...data];
  }, [trades]);

  const chartConfig = {
    pnl: {
      label: "PnL",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2, strokeDasharray: "3 3" }}
          content={<ChartTooltipContent 
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            indicator="dot"
          />}
        />
        <defs>
          <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="pnl"
          type="monotone"
          fill="url(#fillPnl)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{
            r: 4,
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
          activeDot={{
            r: 6,
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
