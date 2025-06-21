"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeTitles: { [key: string]: string } = {
  "/dashboard": "Tableau de bord",
  "/dashboard/features": "Fonctionnalités & Tarifs",
  "/dashboard/tire-details": "Analyse détaillée des pneus",
  "/dashboard/lifespan-prediction": "Prédiction IA de durée de vie",
  "/dashboard/tire-recommendation": "Recommandation IA de pneus",
  "/dashboard/remplissage": "Ancienne Inspection",
  "/dashboard/prediction": "Analyse prédictive du suivi",
  "/selection": "Nouvelle Inspection",
};

export function AppHeader() {
  const pathname = usePathname();
  
  // Find the most specific matching route to handle nested routes like /selection/details/...
  const bestMatch = Object.keys(routeTitles)
    .filter(route => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  const title = bestMatch ? routeTitles[bestMatch] : "";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger aria-label="Basculer la barre latérale" />
      </div>
      
      <div className="flex-1">
        {title ? (
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        ) : (
          <div /> // Placeholder to keep logo to the right
        )}
      </div>
      
      <Link href="/" passHref>
        <div className="cursor-pointer">
          <Image
            src="/logo1.png" 
            alt="TyreTrace AI Logo"
            width={100} 
            height={28} 
            priority 
            className="object-contain"
          />
        </div>
      </Link>
    </header>
  );
}
