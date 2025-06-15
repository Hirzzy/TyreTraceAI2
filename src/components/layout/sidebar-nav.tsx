
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings2,
  FilePlus,
  Palette, // Assuming this was intended for a theme page or similar
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
    label: "Prédiction Durée de Vie",
    tooltip: "Prédire la Durée de Vie des Pneus",
  },
  {
    href: "/tire-recommendation",
    icon: Settings2,
    label: "Recommandation Pneus",
    tooltip: "Recommander les Pneus Optimaux",
  },
  {
    href: "/remplissage",
    icon: FilePlus,
    label: "Saisie Suivi Pneu",
    tooltip: "Ajouter un nouveau suivi de pneu",
  },
  // Example for a potential theme page - remove if not needed
  // {
  //   href: "/theme-settings",
  //   icon: Palette,
  //   label: "Paramètres du Thème",
  //   tooltip: "Personnaliser l'apparence",
  // },
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
              // This onClick will be passed to the Link component.
              // Link handles navigation, and setOpenMobile will close the mobile sidebar.
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
