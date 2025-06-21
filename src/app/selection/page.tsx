
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Truck, ChevronRight } from "lucide-react";

export default function SelectionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Qui êtes-vous ?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sélectionnez votre profil pour accéder à votre espace dédié.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/dashboard" className="block">
          <Card className="h-full hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <CardHeader className="items-center text-center flex-grow">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Client</CardTitle>
              <CardDescription>
                Accédez à votre tableau de bord pour gérer et analyser la performance de votre flotte de pneus.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button>
                Espace Client <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
        <Link href="/fournisseur" className="block">
           <Card className="h-full hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <CardHeader className="items-center text-center flex-grow">
               <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Truck className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Fournisseur</CardTitle>
              <CardDescription>
                Connectez-vous à votre portail pour gérer les commandes, les stocks et la logistique.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button>
                Portail Fournisseur <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
