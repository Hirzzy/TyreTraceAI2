// src/app/(selection)/sous-type/[typeVehicule]/page.tsx
"use client";

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface SubTypeOption {
  label: string;
  value: string;
}

const subTypesMap: Record<string, { title: string; options: SubTypeOption[] }> = {
  pl: {
    title: "Poids Lourd - Type de PL",
    options: [
      { label: "Camion Benne", value: "Camion Benne" },
      { label: "Tracteur Routier", value: "Tracteur Routier" },
      { label: "Porteur", value: "Porteur" },
      { label: "Semi-Remorque", value: "Semi-Remorque" },
    ],
  },
  gc: {
    title: "Génie Civil - Type d'Équipement",
    options: [
      { label: "Chargeuse", value: "LOA" },
      { label: "Tombereau Articulé", value: "ADT" },
      { label: "Tombereau Rigide", value: "RDT" },
      { label: "Niveleuse", value: "NIVELEUSE" },
    ],
  },
  tc4: {
    title: "Tout Chemin 4x4 - Type de Véhicule",
    options: [
      { label: "SUV", value: "SUV" },
      { label: "Utilitaire Léger", value: "Utilitaire Léger" },
      { label: "Véhicule Spécifique", value: "Véhicule Spécifique" },
    ],
  },
};

export default function SelectSubTypePage() {
  const router = useRouter();
  const params = useParams();
  const typeVehicule = params.typeVehicule as string;

  const [pageData, setPageData] = useState<{ title: string; options: SubTypeOption[] } | null>(null);

  useEffect(() => {
    if (typeVehicule && subTypesMap[typeVehicule]) {
      setPageData(subTypesMap[typeVehicule]);
      localStorage.setItem('currentVehicleTypeDisplay', subTypesMap[typeVehicule].title.split(' - ')[0]); // e.g., "Poids Lourd"
    } else {
      // Redirect if typeVehicule is invalid or not found, or handle error
      router.push('/selection/type-vehicule');
    }
  }, [typeVehicule, router]);

  const handleSubTypeSelection = (subTypeValue: string, subTypeLabel: string) => {
    localStorage.setItem('currentVehicleSubTypeDisplay', subTypeLabel);
    router.push(`/selection/details/${typeVehicule}/${encodeURIComponent(subTypeValue)}`);
  };
  
  const handleBack = () => {
    router.push('/selection/type-vehicule');
  };

  if (!pageData) {
    return <div className="text-center text-foreground">Chargement...</div>; // Or a spinner component
  }

  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-xl border-primary/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.3)' }}>
          {pageData.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choisissez le type spécifique :
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {pageData.options.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleSubTypeSelection(option.value, option.label)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
            >
              {option.label}
            </Button>
          ))}
        </div>
         {typeVehicule === 'pl' && (
            <p className="mt-6 text-sm italic text-muted-foreground">
                (Déduction TyreTrace IA : Ce choix influencera les profils de pneus recommandés par l'IA en fonction de votre flotte existante et des données historiques.)
            </p>
        )}
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full mt-8 py-3 text-md border-muted-foreground text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Retour
        </Button>
      </CardContent>
    </Card>
  );
}
