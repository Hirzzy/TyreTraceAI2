"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Tractor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types/vehicle';

// Mock data, to be replaced by API calls
const mockVehicles: Partial<Vehicle>[] = [
    { id: 'V-123', immatriculation: 'AB-123-CD', category: 'Génie Civil – Chargeuse', precoAxle: { "1": 3.0, "2": 3.0 } },
    { id: 'V-456', immatriculation: 'EF-456-GH', category: 'Génie Civil – Tombereau', precoAxle: { "1": 7.0, "2": 7.5 } },
    { id: 'V-789', immatriculation: 'IJ-789-KL', category: 'Poids Lourd – Porteur', precoAxle: { "1": 8.0, "2": 8.5 } },
];

// helpers
const toNum = (v: string) => {
  if (!v && v !== "0") return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const round05 = (n: number) => Math.round(n * 2) / 2;
const inRange = (v: string, min: number, max: number) => {
  if (v === "") return true;
  const n = toNum(v);
  return n != null && n >= min && n <= max;
};

export default function DriverCheckPage() {
    const { toast } = useToast();
    const [countdown, setCountdown] = useState(120);

    // Form state
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [pressureMeasured, setPressureMeasured] = useState('');
    const [pressureTemp, setPressureTemp] = useState<'froid' | 'chaud'>('froid');
    
    // New depth states per position
    const [dAvg, setDAvg] = useState<string>("");  // avant gauche
    const [dAvd, setDAvd] = useState<string>("");  // avant droit
    const [dArg, setDArg] = useState<string>("");  // arrière gauche
    const [dArd, setDArd] = useState<string>("");  // arrière droit

    const selectedVehicle = useMemo(() => mockVehicles.find(v => v.id === selectedVehicleId), [selectedVehicleId]);
    const precoPressure = useMemo(() => {
        if (!selectedVehicle || !selectedVehicle.precoAxle) return 3.0; // Default
        return selectedVehicle.precoAxle["1"];
    }, [selectedVehicle]);

    const depthErr = {
        avg: !inRange(dAvg, 0, 100),
        avd: !inRange(dAvd, 0, 100),
        arg: !inRange(dArg, 0, 100),
        ard: !inRange(dArd, 0, 100),
    };

    const depthStats = useMemo(() => {
        const nums = [dAvg, dAvd, dArg, dArd]
            .map(toNum)
            .filter((v): v is number => v != null)
            .map(round05);
        if (!nums.length) return { avg: null as number | null, spread: null as number | null, min: null as number | null };
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        const avg = +(nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(1);
        const spread = +(max - min).toFixed(1);
        return { avg, spread, min };
    }, [dAvg, dAvd, dArg, dArd]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleValidation = () => {
        toast({
            title: "Check validé !",
            description: "Les données ont été enregistrées. Bonne route !",
        });
    }

    const hasAnyDepth = [dAvg, dAvd, dArg, dArd].some(v => v !== "");
    const canSubmitDepths = hasAnyDepth && !depthErr.avg && !depthErr.avd && !depthErr.arg && !depthErr.ard;
    const isFormValid = selectedVehicleId && (canSubmitDepths || pressureMeasured !== '');

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
            <Card className="w-full bg-card text-card-foreground shadow-xl border-primary/50">
                <CardHeader>
                    <CardDescription>Contrôle sécurité & économie avant démarrage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="vehicle-select">Véhicule</Label>
                        <Select onValueChange={setSelectedVehicleId} value={selectedVehicleId}>
                            <SelectTrigger id="vehicle-select">
                                <SelectValue placeholder="Sélectionnez votre véhicule..." />
                            </SelectTrigger>
                            <SelectContent>
                                {mockVehicles.map(v => (
                                    <SelectItem key={v.id} value={v.id!}>
                                        {v.immatriculation} ({v.category?.split('–')[1].trim()})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 rounded-md border p-4 bg-background shadow-sm">
                        <Label className="text-lg font-semibold text-foreground">Pression (Bar)</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="p-mesuree">Pression mesurée</Label>
                                <Input id="p-mesuree" type="number" value={pressureMeasured} onChange={e => setPressureMeasured(e.target.value)} placeholder="Ex: 7.8" />
                            </div>
                             <div className="space-y-2">
                                <Label>Température de la prise</Label>
                                <RadioGroup value={pressureTemp} onValueChange={(v: 'froid' | 'chaud') => setPressureTemp(v)} className="flex items-center pt-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="froid" id="temp-froid" />
                                        <Label htmlFor="temp-froid">À froid</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="chaud" id="temp-chaud" />
                                        <Label htmlFor="temp-chaud">À chaud</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="pt-2">
                             <Alert variant="default" className="border-blue-400/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-600">
                                <Tractor className="h-4 w-4" />
                                <AlertTitle>Pression préconisée</AlertTitle>
                                <AlertDescription>
                                    La pression recommandée pour ce véhicule est de **{precoPressure.toFixed(1)} Bar**.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-md border p-4 bg-background shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">Profondeur (mm)</h3>
                          <span className="text-xs text-muted-foreground">
                            {depthStats.avg != null ? `moyenne ${depthStats.avg} mm` : "—"}
                            {depthStats.spread != null ? ` • écart ${depthStats.spread} mm` : ""}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-1">avant gauche <span className="text-xs text-muted-foreground">(avg)</span></Label>
                                <Input
                                inputMode="decimal"
                                placeholder="Ex: 8.5"
                                value={dAvg}
                                onChange={(e)=>setDAvg(e.target.value)}
                                className={depthErr.avg ? "border-destructive" : ""}
                                />
                                {depthErr.avg && <p className="mt-1 text-xs text-destructive">Valeur 0–100 mm</p>}
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-1">avant droit <span className="text-xs text-muted-foreground">(avd)</span></Label>
                                <Input
                                inputMode="decimal"
                                placeholder="Ex: 8.5"
                                value={dAvd}
                                onChange={(e)=>setDAvd(e.target.value)}
                                className={depthErr.avd ? "border-destructive" : ""}
                                />
                                {depthErr.avd && <p className="mt-1 text-xs text-destructive">Valeur 0–100 mm</p>}
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-1">arrière gauche <span className="text-xs text-muted-foreground">(arg)</span></Label>
                                <Input
                                inputMode="decimal"
                                placeholder="Ex: 8.5"
                                value={dArg}
                                onChange={(e)=>setDArg(e.target.value)}
                                className={depthErr.arg ? "border-destructive" : ""}
                                />
                                {depthErr.arg && <p className="mt-1 text-xs text-destructive">Valeur 0–100 mm</p>}
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-1">arrière droit <span className="text-xs text-muted-foreground">(ard)</span></Label>
                                <Input
                                inputMode="decimal"
                                placeholder="Ex: 8.5"
                                value={dArd}
                                onChange={(e)=>setDArd(e.target.value)}
                                className={depthErr.ard ? "border-destructive" : ""}
                                />
                                {depthErr.ard && <p className="mt-1 text-xs text-destructive">Valeur 0–100 mm</p>}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost">Annuler</Button>
                    <Button onClick={handleValidation} disabled={!isFormValid}>Valider le Check</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
