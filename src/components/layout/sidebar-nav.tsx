
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings2,
  FilePlus, // Nouvelle icône pour la page de remplissage
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
    href: "/dashboard", // Modifié pour pointer vers /dashboard
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
    label: "Prédiction Durée de Vie",
    tooltip: "Prédire la Durée de Vie des Pneus",
  },
  {
    href: "/tire-recommendation",
    icon: Settings2,
    label: "Recommandation Pneus",
    tooltip: "Recommander les Pneus Optimaux",
  },
  { // Nouvel élément de navigation
    href: "/remplissage",
    icon: FilePlus,
    label: "Saisie Suivi Pneu",
    tooltip: "Ajouter un nouveau suivi de pneu",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} asChild>
            <SidebarMenuButton
              variant="default"
              size="default"
              isActive={pathname === item.href}
              tooltip={{ children: item.tooltip, side: "right", align: "center" }}
              onClick={() => setOpenMobile(false)}
              aria-label={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
