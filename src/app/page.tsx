import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold font-headline tracking-tight mb-4">
          Welcome to PolyJournal
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The best way to analyze your Polymarket trades and sharpen your strategy.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/markets">Explore Markets</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
