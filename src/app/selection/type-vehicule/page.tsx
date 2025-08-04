// src/app/(selection)/type-vehicule/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SelectVehicleTypePage() {
  const router = useRouter();

  const handleVehicleTypeSelection = (type: string) => {
    localStorage.setItem('currentVehicleTypePath', type.toLowerCase()); // e.g. 'pl', 'gc', 'tc4'
    router.push(`/selection/sous-type/${type.toLowerCase()}`);
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" passHref>
          <h1 className="text-center mb-2 text-primary text-3xl md:text-4xl font-extrabold tracking-wide" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.5)' }}>
            TyreTrace IA
          </h1>
      </Link>
      <h2 className="text-center mb-6 text-xl font-semibold text-muted-foreground">
        Négociants
      </h2>
      <Card className="w-full bg-card text-card-foreground shadow-xl border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.3)' }}>
            Nouvelle Inspection
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sélectionnez le type de véhicule pour l'inspection :
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => handleVehicleTypeSelection('PL')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
            >
              Poids Lourd (PL)
            </Button>
            <Button
              onClick={() => handleVehicleTypeSelection('GC')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
            >
              Génie Civil (GC)
            </Button>
            <Button
              onClick={() => handleVehicleTypeSelection('TC4')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
            >
              Tout Chemin 4x4 (TC4)
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/selection')}
            className="w-full mt-8 py-3 text-md border-muted-foreground text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
