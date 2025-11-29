import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PnlChart } from "@/components/dashboard/pnl-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTrades } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <StatsGrid trades={mockTrades} />

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <PnlChart trades={mockTrades} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
