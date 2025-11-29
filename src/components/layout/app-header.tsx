"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        {/* The title is in the sidebar, so we can hide it here on larger screens */}
      </div>
      <Button>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    </header>
  );
}
