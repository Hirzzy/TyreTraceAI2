
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings2,
  FilePlus,
  TrendingUp,
  LogIn,
  LayoutGrid,
  Truck, // Ajout de l'icône
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Tableau de bord",
    tooltip: "Synthèse des performances et alertes",
  },
  {
    href: "/dashboard/vehicles",
    icon: Truck,
    label: "Gestion de Flotte",
    tooltip: "Gérer les véhicules et les inspections",
  },
  {
    href: "/dashboard/features",
    icon: LayoutGrid,
    label: "Fonctionnalités & Tarifs",
    tooltip: "Voir les fonctionnalités et les plans",
  },
  {
    href: "/dashboard/tire-details",
    icon: BarChart3,
    label: "Analyse détaillée des pneus",
    tooltip: "Analyse approfondie des données par pneu",
  },
  {
    href: "/dashboard/lifespan-prediction",
    icon: Clock,
    label: "Prédiction IA de durée de vie",
    tooltip: "Estimer la durée de vie des pneus avec l'IA",
  },
  {
    href: "/dashboard/tire-recommendation",
    icon: Settings2,
    label: "Recommandation IA de pneus",
    tooltip: "Obtenir des recommandations de pneus par l'IA",
  },
  {
    href: "/dashboard/prediction",
    icon: TrendingUp,
    label: "Analyse prédictive du suivi",
    tooltip: "Consulter les analyses prédictives du suivi",
  },
  { 
    href: "/selection/type-vehicule",
    icon: LogIn,
    label: "Nouvelle Inspection",
    tooltip: "Démarrer le nouveau flux de saisie d'inspection",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isNavItemActive = (itemHref: string) => {
    if (itemHref === "/dashboard") {
        return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  }

  return (
    <SidebarMenu>
      {navItems.map((item) => (
         <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              variant="default"
              size="default"
              isActive={isNavItemActive(item.href)}
              tooltip={{ children: item.tooltip, side: "right", align: "center" }}
              onClick={() => {
                setOpenMobile(false);
              }}
              aria-label={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
