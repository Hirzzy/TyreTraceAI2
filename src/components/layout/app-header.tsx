import { SidebarTrigger } from "@/components/ui/sidebar";
import { CarFront } from "lucide-react"; // Using CarFront as a placeholder for a tire/vehicle icon

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger aria-label="Basculer la barre latérale" />
      </div>
      <div className="flex items-center gap-2">
        <CarFront className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">TyreTrace IA</h1>
      </div>
      {/* Add UserMenu or other header items here if needed */}
    </header>
  );
}
