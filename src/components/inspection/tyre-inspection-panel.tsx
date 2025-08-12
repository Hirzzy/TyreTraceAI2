
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HardHat, ChevronsRight, GitBranch, Power, Sprout, Save, AlertTriangle } from 'lucide-react';
import type { VehicleDetails, InspectionData, TyreInspectionPayload, Vehicle } from '@/types';
import { TyreInspectionForm } from './tyre-inspection-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";


interface TyreInspectionPanelProps {
  vehicleDetails: VehicleDetails;
}

type TyrePosition = '1L' | '1R' | '2L' | '2R';

export function TyreInspectionPanel({ vehicleDetails }: TyreInspectionPanelProps) {
  const [inspectionData, setInspectionData] = useState<InspectionData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTyre, setSelectedTyre] = useState<TyrePosition | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleTyreClick = (position: TyrePosition) => {
    setSelectedTyre(position);
    setIsModalOpen(true);
  };

  const handleFormSave = (data: TyreInspectionPayload) => {
    if (selectedTyre) {
      setInspectionData(prev => ({
        ...prev,
        [selectedTyre]: data
      }));
    }
    setIsModalOpen(false);
    setSelectedTyre(null);
  };

  const handleSaveInspection = () => {
    // In a real app, this would go to Firestore. For now, we use localStorage.
    try {
        const existingVehicles: Vehicle[] = JSON.parse(localStorage.getItem('vehicles') || '[]');
        
        // Simple unique ID for demo purposes.
        const newVehicleId = `V-${String(Date.now()).slice(-6)}`;

        const newVehicle: Vehicle = {
            id: newVehicleId,
            immatriculation: `IM-${String(Date.now()).slice(-4)}`, // Placeholder
            fleetNumber: vehicleDetails.model.substring(0, 2).toUpperCase() + "-" + String(Date.now()).slice(-2), // Placeholder
            context: vehicleDetails.category.split('–')[1]?.trim() || 'N/A',
            status: 'ok',
            lastInspectionDate: new Date().toLocaleDateString('fr-FR'),
            activityStatus: 'Actif',
            // Add other details from vehicleDetails if needed in the Vehicle type
            brand: vehicleDetails.brand,
            model: vehicleDetails.model,
            dimension: vehicleDetails.dimension,
        };

        const updatedVehicles = [...existingVehicles, newVehicle];
        localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        localStorage.setItem(`inspection_${newVehicleId}`, JSON.stringify({ vehicleDetails, inspectionData }));

        toast({
            title: "Inspection Enregistrée",
            description: `Le véhicule ${newVehicle.fleetNumber} a été ajouté à votre flotte.`,
        });

        router.push('/dashboard/vehicles');

    } catch (error) {
        console.error("Failed to save to localStorage:", error);
        toast({
            variant: "destructive",
            title: "Erreur d'enregistrement",
            description: "Impossible de sauvegarder l'inspection dans le stockage local.",
        });
    }
  };
  
  const getTyreStatus = (position: TyrePosition) => {
    if (inspectionData[position]) return 'inspected';
    return 'pending';
  }

  // --- Cross-axle check ---
  const axle1L = inspectionData['1L']?.depth.avg;
  const axle1R = inspectionData['1R']?.depth.avg;
  const axle2L = inspectionData['2L']?.depth.avg;
  const axle2R = inspectionData['2R']?.depth.avg;

  let axle1Imbalance = false;
  let axle2Imbalance = false;

  if (axle1L !== undefined && axle1L !== null && axle1R !== undefined && axle1R !== null) {
      if (Math.abs(axle1L - axle1R) > 3) {
          axle1Imbalance = true;
      }
  }
  if (axle2L !== undefined && axle2L !== null && axle2R !== undefined && axle2R !== null) {
      if (Math.abs(axle2L - axle2R) > 3) {
          axle2Imbalance = true;
      }
  }


  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground shadow-xl border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.3)' }}>
            Encodage des Pneus
          </CardTitle>
          <CardDescription className="text-muted-foreground">{vehicleDetails.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="flex items-center gap-1"><HardHat size={14} />{vehicleDetails.brand} - {vehicleDetails.model}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><ChevronsRight size={14} />{vehicleDetails.dimension}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><GitBranch size={14} />{vehicleDetails.driveConfig}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Power size={14} />{vehicleDetails.motor}</Badge>
            {vehicleDetails.typeSol.map(sol => (
              <Badge key={sol} variant="secondary" className="flex items-center gap-1"><Sprout size={14} />{sol}</Badge>
            ))}
          </div>

          <Separator className="my-4" />

          { (axle1Imbalance || axle2Imbalance) &&
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alerte de déséquilibre</AlertTitle>
                <AlertDescription>
                    {axle1Imbalance && <p>Déséquilibre d'usure détecté sur l'essieu 1 (&gt;3 mm).</p>}
                    {axle2Imbalance && <p>Déséquilibre d'usure détecté sur l'essieu 2 (&gt;3 mm).</p>}
                </AlertDescription>
            </Alert>
          }

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10 p-4 bg-background/80 rounded-lg backdrop-blur-sm border">
                <div className="text-center">
                    <p className="text-xs font-bold text-muted-foreground">PRESSION PRÉCO. (BAR)</p>
                    <p className="text-lg font-bold text-primary">Essieu 1: <span className="font-extrabold">{vehicleDetails.precoAxle['1'].toFixed(1)}</span></p>
                    <p className="text-lg font-bold text-primary">Essieu 2: <span className="font-extrabold">{vehicleDetails.precoAxle['2'].toFixed(1)}</span></p>
                </div>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-y-16 gap-x-4">
              <TyreButton position="1L" status={getTyreStatus('1L')} onClick={handleTyreClick} inspectionData={inspectionData['1L']} />
              <div className="w-8 h-1 bg-muted-foreground rounded-full" />
              <TyreButton position="1R" status={getTyreStatus('1R')} onClick={handleTyreClick} inspectionData={inspectionData['1R']} />
              
              <div className="h-2 w-full bg-muted-foreground rounded-full col-start-1 col-end-2" />
              <div className="h-2 w-full bg-muted-foreground rounded-full col-start-3 col-end-4" />
              
              <TyreButton position="2L" status={getTyreStatus('2L')} onClick={handleTyreClick} inspectionData={inspectionData['2L']} />
              <div className="w-8 h-1 bg-muted-foreground rounded-full" />
              <TyreButton position="2R" status={getTyreStatus('2R')} onClick={handleTyreClick} inspectionData={inspectionData['2R']} />
            </div>
          </div>
        </CardContent>
         <CardFooter className="flex-col gap-4 pt-6">
            <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                disabled={Object.keys(inspectionData).length !== 4}
                onClick={handleSaveInspection}
            >
                <Save className="mr-2 h-5 w-5" />
                Enregistrer l'inspection complète
            </Button>
             <p className="text-xs text-muted-foreground">
                {4 - Object.keys(inspectionData).length} pneu(s) restant(s) à inspecter.
             </p>
        </CardFooter>
      </Card>

      {selectedTyre && (
        <TyreInspectionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleFormSave}
          tyrePosition={selectedTyre}
          precoPressure={vehicleDetails.precoAxle[selectedTyre.startsWith('1') ? '1' : '2']}
          existingData={inspectionData[selectedTyre]}
        />
      )}
    </>
  );
}

interface TyreButtonProps {
    position: TyrePosition;
    status: 'pending' | 'inspected';
    onClick: (position: TyrePosition) => void;
    inspectionData?: TyreInspectionPayload;
}
const TyreButton = ({ position, status, onClick, inspectionData }: TyreButtonProps) => {
    const isInspected = status === 'inspected';
    return (
        <Button
          variant={isInspected ? "default" : "outline"}
          className={`w-28 h-36 text-lg font-bold transition-all duration-300 flex flex-col justify-center items-center gap-1 ${
            isInspected 
              ? 'bg-green-500 hover:bg-green-600 text-white border-green-700' 
              : 'border-dashed border-2 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
          }`}
          onClick={() => onClick(position)}
        >
          <span>{position}</span>
           {isInspected && inspectionData && (
              <div className="text-xs font-normal mt-1 text-center">
                 <p>P: {inspectionData.pressure.measuredBar}b</p>
                 <p>Ø: {inspectionData.depth.avg?.toFixed(1)}mm</p>
              </div>
           )}
        </Button>
    )
}
