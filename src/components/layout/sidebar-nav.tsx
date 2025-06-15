"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Settings2,
  CarFront,
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
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    tooltip: "Performance Overview",
  },
  {
    href: "/tire-details",
    icon: BarChart3,
    label: "Tire Details",
    tooltip: "Detailed Tire Charts",
  },
  {
    href: "/lifespan-prediction",
    icon: Clock,
    label: "Lifespan Prediction",
    tooltip: "Predict Tire Lifespan",
  },
  {
    href: "/tire-recommendation",
    icon: Settings2,
    label: "Tire Recommendation",
    tooltip: "Recommend Optimal Tires",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              variant="default"
              size="default"
              isActive={pathname === item.href}
              tooltip={{ children: item.tooltip, side: "right", align: "center" }}
              onClick={() => setOpenMobile(false)}
              aria-label={item.label}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
