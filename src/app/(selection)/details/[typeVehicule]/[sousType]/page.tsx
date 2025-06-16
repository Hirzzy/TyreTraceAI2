// src/app/(selection)/details/[typeVehicule]/[sousType]/page.tsx
"use client";

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

export default function EnterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const typeVehiculePath = params.typeVehicule as string;
  // const sousTypePath = decodeURIComponent(params.sousType as string); // Not directly used for display text from path

  const [displayVehicleType, setDisplayVehicleType] = useState('');
  const [displayVehicleSubType, setDisplayVehicleSubType] = useState('');
  const [marque, setMarque] = useState('');
  const [dimension, setDimension] = useState('');

  useEffect(() => {
    // Retrieve display names from localStorage
    const storedType = localStorage.getItem('currentVehicleTypeDisplay');
    const storedSubType = localStorage.getItem('currentVehicleSubTypeDisplay');
    
    if (storedType) setDisplayVehicleType(storedType);
    if (storedSubType) setDisplayVehicleSubType(storedSubType);

  }, []);

  const handleSubmit = () => {
    // Here you would typically save the data (marque, dimension)
    // For now, let's log it and navigate to a hypothetical confirmation or back to selection start
    console.log({
      typeVehicule: displayVehicleType,
      sousType: displayVehicleSubType,
      marque,
      dimension,
    });
    alert(`Informations saisies : \nType: ${displayVehicleType}\nSous-type: ${displayVehicleSubType}\nMarque: ${marque}\nDimension: ${dimension}\n\nLa fonctionnalité de sauvegarde sera implémentée ultérieurement.`);
    router.push('/selection'); // Or to a confirmation page
  };

  const handleBack = () => {
    router.push(`/selection/sous-type/${typeVehiculePath}`);
  };

  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-xl border-primary/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.3)' }}>
          Saisir les Détails
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Véhicule : <span className="font-semibold text-primary">{displayVehicleType} - {displayVehicleSubType}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="marque" className="text-left text-foreground">Marque du véhicule :</Label>
            <Input
              id="marque"
              type="text"
              placeholder="Ex: Caterpillar, Renault"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              className="bg-input border-primary/30 focus:border-primary focus:ring-primary placeholder:text-muted-foreground/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimension" className="text-left text-foreground">Dimension du pneu :</Label>
            <Input
              id="dimension"
              type="text"
              placeholder="Ex: 20.5R25, 385/65R22.5"
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="bg-input border-primary/30 focus:border-primary focus:ring-primary placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-md"
        >
          Valider les informations
        </Button>
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full mt-4 py-3 text-md border-muted-foreground text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Retour
        </Button>
      </CardContent>
    </Card>
  );
}
