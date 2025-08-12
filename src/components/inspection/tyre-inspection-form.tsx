
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TyreInspectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { pressure: number; depth: number }) => void;
  tyrePosition: string;
  precoPressure: number;
  existingData?: { pressure: number; depth: number };
}

export function TyreInspectionForm({
  isOpen,
  onClose,
  onSave,
  tyrePosition,
  precoPressure,
  existingData,
}: TyreInspectionFormProps) {
  const [pressure, setPressure] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [pressureDiff, setPressureDiff] = useState<number | null>(null);

  useEffect(() => {
    if (existingData) {
      setPressure(String(existingData.pressure));
      setDepth(String(existingData.depth));
    } else {
      setPressure('');
      setDepth('');
    }
    setPressureDiff(null); 
  }, [isOpen, existingData]);

  useEffect(() => {
    const pressureNum = parseFloat(pressure);
    if (!isNaN(pressureNum) && precoPressure) {
      setPressureDiff(Math.abs(pressureNum - precoPressure));
    } else {
      setPressureDiff(null);
    }
  }, [pressure, precoPressure]);

  const handleSave = () => {
    const pressureNum = parseFloat(pressure);
    const depthNum = parseFloat(depth);

    if (isNaN(pressureNum) || isNaN(depthNum) || pressureNum <= 0 || depthNum <= 0) {
      alert('Veuillez saisir des valeurs valides et positives pour la pression et la profondeur.');
      return;
    }
    onSave({ pressure: pressureNum, depth: depthNum });
  };
  
  const isFormValid = pressure !== '' && depth !== '';
  const isPressureAlert = pressureDiff !== null && pressureDiff > precoPressure * 0.1; // Alerte si > 10% d'écart

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inspection du Pneu ({tyrePosition})</DialogTitle>
          <DialogDescription>
            Saisissez la pression et la profondeur de sculpture mesurées.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pressure" className="text-right">
              Pression (Bar)
            </Label>
            <Input
              id="pressure"
              type="number"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              className="col-span-3"
              placeholder={`Préco: ${precoPressure.toFixed(1)} Bar`}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="depth" className="text-right">
              Profondeur (mm)
            </Label>
            <Input
              id="depth"
              type="number"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="col-span-3"
              placeholder="Ex: 8"
            />
          </div>
          {isPressureAlert && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Attention : Écart de pression de <strong>{pressureDiff?.toFixed(2)} Bar</strong> détecté (supérieur à la tolérance de 10%).
                </AlertDescription>
             </Alert>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!isFormValid}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

