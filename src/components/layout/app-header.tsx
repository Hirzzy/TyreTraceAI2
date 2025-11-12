
"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <SidebarTrigger aria-label="Basculer la barre latérale" />
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <Link href="/" passHref>
          <div className="cursor-pointer">
            <span className="font-bold text-xl text-primary">TyreTrace AI</span>
          </div>
        </Link>
      </div>

      {/* Placeholder to balance the flex layout and keep the logo centered */}
      <div className="w-10 h-10"></div>
      
    </header>
  );
}
