
"use client";

import { useEffect, useState, useMemo } from 'react';
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
import { AlertCircle, CheckCircle, Info, Ban } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { TyreInspectionPayload, TyreDepth, TyrePressure } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toHuman, TyrePos } from '@/lib/tyre-position';


interface TyreInspectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TyreInspectionPayload) => void;
  tyrePosition: TyrePos;
  precoPressure: number;
  existingData?: TyreInspectionPayload;
}

const toNum = (s?: string | null): number | null => {
    if (s === null || s === undefined || s.trim() === "") return null;
    const cleaned = String(s).replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
};

const roundToHalf = (n: number | null): number | null => {
    if (n === null) return null;
    return Math.round(n * 2) / 2;
};

const computeStats = (vals: (number | null)[]): Omit<TyreDepth, 'inner' | 'center' | 'outer'> => {
  const validVals = vals.filter((v): v is number => v !== null && isFinite(v));
  const n = validVals.length;

  if (n === 0) return { avg: null, min: null, max: null, spread: null, std: null, qualityScore: null };
  
  const min = Math.min(...validVals);
  const max = Math.max(...validVals);
  const avg = validVals.reduce((a, b) => a + b, 0) / n;
  const spread = max - min;
  const std = n > 1 ? Math.sqrt(validVals.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / (n -1)) : 0; // Sample StDev

  return { avg, min, max, spread, std: roundToHalf(std), qualityScore: 0 }; // qualityScore computed later
}


export function TyreInspectionForm({
  isOpen,
  onClose,
  onSave,
  tyrePosition,
  precoPressure,
  existingData,
}: TyreInspectionFormProps) {
  // --- STATE MANAGEMENT ---
  const [pressureMeasured, setPressureMeasured] = useState<string>('');
  const [pressureCorrected, setPressureCorrected] = useState<string>('');
  
  const [depthInner, setDepthInner] = useState<string>('');
  const [depthCenter, setDepthCenter] = useState<string>('');
  const [depthOuter, setDepthOuter] = useState<string>('');

  useEffect(() => {
    if (isOpen && existingData) {
      setPressureMeasured(String(existingData.pressure.measuredBar ?? ''));
      setPressureCorrected(String(existingData.pressure.correctedBar ?? ''));
      setDepthInner(String(existingData.depth.inner ?? ''));
      setDepthCenter(String(existingData.depth.center ?? ''));
      setDepthOuter(String(existingData.depth.outer ?? ''));
    } else if (isOpen) {
      // Reset form on open if no existing data
      setPressureMeasured('');
      setPressureCorrected('');
      setDepthInner('');
      setDepthCenter('');
      setDepthOuter('');
    }
  }, [isOpen, existingData]);

  // --- PARSED & COMPUTED VALUES ---
  const { pressure, depth, errors, warnings, isFormValid, canSave } = useMemo(() => {
    const pMeasuredNum = toNum(pressureMeasured);
    const pCorrectedNum = toNum(pressureCorrected);
    const dInnerNum = toNum(depthInner);
    const dCenterNum = toNum(depthCenter);
    const dOuterNum = toNum(depthOuter);
    
    const depthValues = [dInnerNum, dCenterNum, dOuterNum];
    const depthStats = computeStats(depthValues);
    
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validations
    if (depthStats.spread !== null && depthStats.spread > 5) {
      errors.push("Écart I/C/E inhabituel (>5 mm). Reprends la mesure.");
    }

    // Warnings
    const validDepths = depthValues.filter((v): v is number => v !== null);
    if (dCenterNum !== null && dInnerNum !== null && dOuterNum !== null) {
      if (dCenterNum - Math.min(dInnerNum, dOuterNum) >= 3) {
        warnings.push("Usure épaules : vérifier sous-gonflage/alignement.");
      }
      if (Math.max(dInnerNum, dOuterNum) - dCenterNum >= 3) {
        warnings.push("Usure centrale : possible sur-gonflage.");
      }
    }
    if (validDepths.some(d => d < 3)) {
        warnings.push("Proche témoin : planifier permutation/remplacement.");
    }
    if (pMeasuredNum !== null && Math.abs(pMeasuredNum - precoPressure) >= 0.5) {
        warnings.push(`Écart de pression de ${Math.abs(pMeasuredNum - precoPressure).toFixed(2)} Bar détecté.`);
    }

    const isFormValid = errors.length === 0;
    const canSave = isFormValid && (validDepths.length > 0 || pMeasuredNum !== null);

    return {
      pressure: { measuredBar: pMeasuredNum, recommendedBar: precoPressure, correctedBar: pCorrectedNum },
      depth: { inner: dInnerNum, center: dCenterNum, outer: dOuterNum, ...depthStats },
      errors,
      warnings,
      isFormValid,
      canSave,
    };
  }, [pressureMeasured, pressureCorrected, depthInner, depthCenter, depthOuter, precoPressure]);


  const handleSave = () => {
    if (!canSave) return;
    
    const payload: TyreInspectionPayload = {
        position: tyrePosition,
        positionHuman: toHuman(tyrePosition),
        depth: depth,
        pressure: pressure,
        measureMeta: {
            tool: "pige mécanique", // default for now
            side: tyrePosition.includes('L') ? "gauche" : "droite",
            timestamp: new Date().toISOString(),
        },
        status: 'completed',
        inspectedAt: new Date().toISOString(),
        version: 2
    };
    onSave(payload);
  };
  
  const humanPos = toHuman(tyrePosition);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inspection du pneu ({humanPos.long})</DialogTitle>
          <DialogDescription>
            Saisissez les profondeurs et la pression. Les calculs sont automatiques.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Pressure Section */}
          <div className="space-y-2 rounded-md border p-3 bg-background shadow-sm">
            <Label className="font-semibold text-foreground">Pression (Bar)</Label>
            <div className="grid grid-cols-3 gap-x-2 gap-y-3">
              <div className="space-y-1">
                <Label htmlFor="p-mesuree" className="text-xs text-muted-foreground">Mesurée</Label>
                <Input id="p-mesuree" type="text" inputMode="decimal" value={pressureMeasured} onChange={e => setPressureMeasured(e.target.value)} placeholder="Ex: 8.5" />
              </div>
               <div className="space-y-1">
                <Label htmlFor="p-preco" className="text-xs text-muted-foreground">Préconisée</Label>
                <Input id="p-preco" type="text" value={precoPressure.toFixed(1)} readOnly disabled className="font-bold text-primary"/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="p-corrigee" className="text-xs text-muted-foreground">Corrigée</Label>
                <Input id="p-corrigee" type="text" inputMode="decimal" value={pressureCorrected} onChange={e => setPressureCorrected(e.target.value)} placeholder="(Optionnel)" />
              </div>
            </div>
          </div>
          
          {/* Depth Section */}
          <div className="space-y-2 rounded-md border p-3 bg-background shadow-sm">
            <div className="flex items-center gap-2">
                <Label className="font-semibold text-foreground">Profondeur de sculpture (mm)</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">Mesurer au fond de rainure, pige perpendiculaire. Faire 2 lectures et garder la meilleure.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-3">
               <div className="space-y-1">
                <Label htmlFor="d-int" className="text-xs text-muted-foreground">Intérieur</Label>
                <Input id="d-int" type="text" inputMode="decimal" value={depthInner} onChange={e => setDepthInner(e.target.value)} placeholder="Ex: 12" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="d-centre" className="text-xs text-muted-foreground">Centre</Label>
                <Input id="d-centre" type="text" inputMode="decimal" value={depthCenter} onChange={e => setDepthCenter(e.target.value)} placeholder="Ex: 12.5" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="d-ext" className="text-xs text-muted-foreground">Extérieur</Label>
                <Input id="d-ext" type="text" inputMode="decimal" value={depthOuter} onChange={e => setDepthOuter(e.target.value)} placeholder="Ex: 11.5" />
              </div>
            </div>
             {/* Stats */}
             {depth.avg !== null && (
              <div className="pt-3 text-xs text-muted-foreground grid grid-cols-3 gap-x-2">
                <p>Moy: <strong className="text-foreground">{depth.avg.toFixed(1)}mm</strong></p>
                <p>Écart: <strong className="text-foreground">{depth.spread?.toFixed(1)}mm</strong></p>
                <p>Min: <strong className="text-foreground">{depth.min?.toFixed(1)}mm</strong></p>
              </div>
            )}
          </div>

           {/* Alerts & Warnings */}
           <div className="space-y-2">
            {!isFormValid && (
                <Alert variant="destructive">
                    <Ban className="h-4 w-4" />
                    <AlertTitle>Erreur de saisie</AlertTitle>
                    <AlertDescription>
                        <ul>
                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            {warnings.length > 0 && isFormValid && (
                 <Alert variant="default" className="border-yellow-400/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Avertissements</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                        </ul>
                    </AlertDescription>
                 </Alert>
            )}
           </div>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!canSave}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
