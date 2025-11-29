import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <div className="mb-8">
        <Logo className="h-24 w-24 text-primary" />
      </div>
      <h1 className="text-5xl font-bold font-headline tracking-tight mb-4">
        Welcome to PolyJournal
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        The best way to visualize your Polymarket trades, get AI-powered feedback on your theses, and sharpen your strategy.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/markets">Explore Markets</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">View Your Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
