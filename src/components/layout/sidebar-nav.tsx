
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
    label: "Tableau de Bord",
    tooltip: "Synthèse des performances et alertes",
  },
  {
    href: "/tire-details",
    icon: BarChart3,
    label: "Analyse Détaillée des Pneus",
    tooltip: "Analyse approfondie des données par pneu",
  },
  {
    href: "/lifespan-prediction",
    icon: Clock,
    label: "Prédiction IA de Durée de Vie",
    tooltip: "Estimer la durée de vie des pneus avec l'IA",
  },
  {
    href: "/tire-recommendation",
    icon: Settings2,
    label: "Recommandation IA de Pneus",
    tooltip: "Obtenir des recommandations de pneus par l'IA",
  },
  {
    href: "/remplissage",
    icon: FilePlus,
    label: "Saisie de Suivi des Pneus",
    tooltip: "Enregistrer les nouvelles données de suivi",
  },
  {
    href: "/prediction",
    icon: TrendingUp,
    label: "Analyse Prédictive du Suivi",
    tooltip: "Consulter les analyses prédictives du suivi",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
         <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              variant="default"
              size="default"
              isActive={pathname === item.href}
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
