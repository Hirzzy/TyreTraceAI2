
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CarFront, Home, LogIn } from "lucide-react"; 

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger aria-label="Basculer la barre latérale" />
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <CarFront className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">TyreTrace IA</h1>
        </div>
        <Link href="/" passHref>
          <Button variant="outline" size="sm" className="ml-4">
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </Link>
      </div>
      
      <Link href="/selection" passHref>
        <Button variant="ghost" size="icon" aria-label="Connexion ou Nouvelle Inspection">
          <LogIn className="h-5 w-5 text-foreground" />
        </Button>
      </Link>
      {/* Add UserMenu or other header items here if needed in the future */}
    </header>
  );
}
