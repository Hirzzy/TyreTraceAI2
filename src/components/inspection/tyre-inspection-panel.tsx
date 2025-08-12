
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HardHat, ChevronsRight, GitBranch, Power, Sprout, Save } from 'lucide-react';
import type { VehicleDetails, InspectionData } from '@/types';
import { TyreInspectionForm } from './tyre-inspection-form';

interface TyreInspectionPanelProps {
  vehicleDetails: VehicleDetails;
}

type TyrePosition = '1L' | '1R' | '2L' | '2R';

export function TyreInspectionPanel({ vehicleDetails }: TyreInspectionPanelProps) {
  const [inspectionData, setInspectionData] = useState<InspectionData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTyre, setSelectedTyre] = useState<TyrePosition | null>(null);

  const handleTyreClick = (position: TyrePosition) => {
    setSelectedTyre(position);
    setIsModalOpen(true);
  };

  const handleFormSave = (data: { pressure: number; depth: number }) => {
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
    console.log("[SAVE] Inspection", { vehicleDetails, inspectionData });
    alert("Inspection enregistrée ! (Voir la console pour les données)");
  };
  
  const getTyreStatus = (position: TyrePosition) => {
    if (inspectionData[position]) return 'inspected';
    return 'pending';
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
          {/* Badges récapitulatifs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="flex items-center gap-1"><HardHat size={14} />{vehicleDetails.brand} - {vehicleDetails.model}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><ChevronsRight size={14} />{vehicleDetails.dimension}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><GitBranch size={14} />{vehicleDetails.driveConfig}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Power size={14} />{vehicleDetails.motor}</Badge>
            {vehicleDetails.typeSol.map(sol => (
              <Badge key={sol} variant="secondary" className="flex items-center gap-1"><Sprout size={14} />{sol}</Badge>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Schéma du véhicule et préconisations */}
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10 p-4 bg-background/80 rounded-lg backdrop-blur-sm border">
                <div className="text-center">
                    <p className="text-xs font-bold text-muted-foreground">PRESSION PRÉCO. (BAR)</p>
                    <p className="text-lg font-bold text-primary">Essieu 1: <span className="font-extrabold">{vehicleDetails.precoAxle['1'].toFixed(1)}</span></p>
                    <p className="text-lg font-bold text-primary">Essieu 2: <span className="font-extrabold">{vehicleDetails.precoAxle['2'].toFixed(1)}</span></p>
                </div>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-y-16 gap-x-4">
              {/* Pneus avant */}
              <TyreButton position="1L" status={getTyreStatus('1L')} onClick={handleTyreClick} />
              <div className="w-8 h-1 bg-muted-foreground rounded-full" />
              <TyreButton position="1R" status={getTyreStatus('1R')} onClick={handleTyreClick} />
              
              {/* Châssis */}
              <div className="h-2 w-full bg-muted-foreground rounded-full col-start-1 col-end-2" />
              <div className="h-2 w-full bg-muted-foreground rounded-full col-start-3 col-end-4" />
              
              {/* Pneus arrière */}
              <TyreButton position="2L" status={getTyreStatus('2L')} onClick={handleTyreClick} />
              <div className="w-8 h-1 bg-muted-foreground rounded-full" />
              <TyreButton position="2R" status={getTyreStatus('2R')} onClick={handleTyreClick} />
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

// Composant interne pour les boutons de pneu
interface TyreButtonProps {
    position: TyrePosition;
    status: 'pending' | 'inspected';
    onClick: (position: TyrePosition) => void;
}
const TyreButton = ({ position, status, onClick }: TyreButtonProps) => {
    const isInspected = status === 'inspected';
    return (
        <Button
          variant={isInspected ? "default" : "outline"}
          className={`w-24 h-32 text-lg font-bold transition-all duration-300 ${
            isInspected 
              ? 'bg-green-500 hover:bg-green-600 text-white border-green-700' 
              : 'border-dashed border-2 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
          }`}
          onClick={() => onClick(position)}
        >
          {position}
        </Button>
    )
}
