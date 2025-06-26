// src/app/selection/inspection/summary/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { VehicleDetailsFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function InspectionSummaryPage() {
  const router = useRouter();
  const [details, setDetails] = useState<VehicleDetailsFormData | null>(null);
  const [inspectionDate, setInspectionDate] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('vehicleInspectionDetails');
      if (storedData) {
        setDetails(JSON.parse(storedData));
      } else {
        // Redirect if no data is found, maybe back to the start
        router.push('/selection/type-vehicule');
      }
      // Format date to DD/MM/YYYY
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      setInspectionDate(`${day}/${month}/${year}`);

    } catch (error) {
      console.error("Erreur de lecture du localStorage:", error);
      router.push('/selection/type-vehicule');
    }
  }, [router]);

  const handleFinishInspection = () => {
    // Here you would typically save the full inspection data to your backend
    console.log("Inspection terminée pour :", details);
    // For now, let's just clear the stored data and navigate
    localStorage.removeItem('vehicleInspectionDetails');
    router.push('/dashboard/vehicles');
  };

  if (!details) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Chargement des détails de l'inspection...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Détails de l’inspection</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Card className="w-full max-w-2xl mx-auto shadow-lg">
                <CardContent className="pt-6">
                    <div className="w-full mb-6">
                        <Image
                            src="https://placehold.co/800x400.png"
                            alt="Disposition des pneus du véhicule"
                            width={800}
                            height={400}
                            className="rounded-lg object-cover"
                            data-ai-hint="tire layout diagram"
                        />
                         <div className="text-center mt-2 text-sm text-muted-foreground">Représentation des essieux et pressions.</div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Véhicule</Label>
                            <p className="font-semibold text-lg">{details.sousType ? `${details.typeVehicule} - ${details.sousType}` : details.typeVehicule}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="inspection-date">Date d’inspection</Label>
                                <Input id="inspection-date" value={inspectionDate} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mileage">Kilométrage</Label>
                                <Input id="mileage" placeholder="Saisir le kilométrage..." />
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-lg font-semibold text-primary">Détails des pneus</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div><span className="font-medium text-muted-foreground">Dimension:</span> {details.dimension}</div>
                                <div><span className="font-medium text-muted-foreground">Marque:</span> BFGoodrich</div>
                                <div><span className="font-medium text-muted-foreground">Profil:</span> ALG CONTROL</div>
                                <div><span className="font-medium text-muted-foreground">N° de série:</span> CJFJ010101</div>
                                <div><span className="font-medium text-muted-foreground">Recreusé:</span> Non</div>
                                <div><span className="font-medium text-muted-foreground">N° de vie:</span> New</div>
                                <div><span className="font-medium text-muted-foreground">Saison:</span> -</div>
                                <div className="col-span-2"><span className="font-medium text-muted-foreground">Produit:</span> 29.5 R 25 ALG CONTROL E3 L3 TL ** (569862)</div>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <h3 className="text-lg font-semibold text-primary">Observations</h3>
                             <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">Aucune observation actuelle.</p>
                             <Label htmlFor="comments">Commentaires</Label>
                            <Textarea id="comments" placeholder="Ajouter des commentaires supplémentaires ici..." />
                        </div>

                        <div className="pt-4">
                            <Button onClick={handleFinishInspection} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                                Terminer l’inspection
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
