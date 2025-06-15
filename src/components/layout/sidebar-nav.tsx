
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings2,
  FilePlus,
  TrendingUp, // Ajout de l'icône pour la nouvelle page
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
    tooltip: "Aperçu des Performances",
  },
  {
    href: "/tire-details",
    icon: BarChart3,
    label: "Détails des Pneus",
    tooltip: "Graphiques Détaillés des Pneus",
  },
  {
    href: "/lifespan-prediction",
    icon: Clock,
    label: "Prédiction IA Durée Vie",
    tooltip: "Prédire la Durée de Vie des Pneus (IA)",
  },
  {
    href: "/tire-recommendation",
    icon: Settings2,
    label: "Recommandation IA Pneus",
    tooltip: "Recommander les Pneus Optimaux (IA)",
  },
  {
    href: "/remplissage",
    icon: FilePlus,
    label: "Saisie Suivi Pneu",
    tooltip: "Ajouter un nouveau suivi de pneu",
  },
  {
    href: "/prediction", // Nouveau lien
    icon: TrendingUp,    // Nouvelle icône
    label: "Prédictions Suivi",
    tooltip: "Voir les prédictions de durée de vie",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile, open } = useSidebar(); // 'open' is used for desktop logic if needed

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
