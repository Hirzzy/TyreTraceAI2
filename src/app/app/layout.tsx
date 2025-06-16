
import { AppHeader } from "@/components/layout/app-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AppFooter } from "@/components/layout/app-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { CarFront } from "lucide-react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="border-b">
           <div className="flex items-center gap-2 py-2 group-data-[collapsible=icon]:justify-center">
            <CarFront className="h-7 w-7 text-primary" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">TyreTrace AI</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 overflow-auto"> {/* Main app pages will now control their own root padding */}
            {children}
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
