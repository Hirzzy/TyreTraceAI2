// src/app/selection/inspection/summary/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [mileage, setMileage] = useState('');
  const [comments, setComments] = useState('');
  const [depth1, setDepth1] = useState('');
  const [depth2, setDepth2] = useState('');
  const [depth3, setDepth3] = useState('');
  const [pressure, setPressure] = useState('');

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
    const inspectionData = {
        details,
        inspectionDate,
        mileage,
        tire_1L: {
            depth1,
            depth2,
            depth3,
            pressure,
        },
        comments,
    };
    // Here you would typically save the full inspection data to your backend
    console.log("Inspection terminée pour :", inspectionData);
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
                    <div className="w-full mb-6 p-4 border rounded-lg bg-muted/50">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Inspection du Pneu (Position 1L)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="depth1_1L">Profondeur 1 [mm]</Label>
                                <Input type="number" id="depth1_1L" value={depth1} onChange={(e) => setDepth1(e.target.value)} placeholder="mm" />
                            </div>
                            <div>
                                <Label htmlFor="depth2_1L">Profondeur 2 [mm]</Label>
                                <Input type="number" id="depth2_1L" value={depth2} onChange={(e) => setDepth2(e.target.value)} placeholder="mm (optionnel)" />
                            </div>
                            <div>
                                <Label htmlFor="depth3_1L">Profondeur 3 [mm]</Label>
                                <Input type="number" id="depth3_1L" value={depth3} onChange={(e) => setDepth3(e.target.value)} placeholder="mm (optionnel)" />
                            </div>
                            <div>
                                <Label htmlFor="pressure_1L">Pression mesurée [bar]</Label>
                                <Input type="number" id="pressure_1L" value={pressure} onChange={(e) => setPressure(e.target.value)} placeholder="bar" step="0.1" />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="pressure_rec_1L">Pression préconisée [bar]</Label>
                                <Input type="number" id="pressure_rec_1L" value="3.5" readOnly disabled className="bg-slate-100" />
                            </div>
                        </div>
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
                                <Input id="mileage" placeholder="Saisir le kilométrage..." value={mileage} onChange={(e) => setMileage(e.target.value)} />
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
                            <Textarea id="comments" placeholder="Ajouter des commentaires supplémentaires ici..." value={comments} onChange={(e) => setComments(e.target.value)} />
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
