"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlertTriangle, Clock, Tractor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from '@/types/vehicle';

// Mock data, to be replaced by API calls
const mockVehicles: Partial<Vehicle>[] = [
    { id: 'V-123', immatriculation: 'AB-123-CD', category: 'Génie Civil – Chargeuse', precoAxle: { "1": 3.0, "2": 3.0 } },
    { id: 'V-456', immatriculation: 'EF-456-GH', category: 'Génie Civil – Tombereau', precoAxle: { "1": 7.0, "2": 7.5 } },
    { id: 'V-789', immatriculation: 'IJ-789-KL', category: 'Poids Lourd – Porteur', precoAxle: { "1": 8.0, "2": 8.5 } },
];

export default function DriverCheckPage() {
    const { toast } = useToast();
    const [countdown, setCountdown] = useState(120);

    // Form state
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [pressureMeasured, setPressureMeasured] = useState('');
    const [pressureTemp, setPressureTemp] = useState<'froid' | 'chaud'>('froid');
    const [depthMode, setDepthMode] = useState<'rapide' | 'complet'>('rapide');
    const [depthValues, setDepthValues] = useState({ inner: '', center: '', outer: '' });

    const selectedVehicle = useMemo(() => mockVehicles.find(v => v.id === selectedVehicleId), [selectedVehicleId]);
    const precoPressure = useMemo(() => {
        if (!selectedVehicle || !selectedVehicle.precoAxle) return 3.0; // Default
        // Simplified: using axle 1 pressure as global for now. To be refined.
        return selectedVehicle.precoAxle["1"];
    }, [selectedVehicle]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleValidation = () => {
        // Placeholder for the business logic from the ticket
        toast({
            title: "Check validé !",
            description: "Les données ont été enregistrées. Bonne route !",
        });
    }
    
    const isFormValid = !!selectedVehicleId && (!!pressureMeasured || !!depthValues.inner);

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
            <Card className="w-full bg-card text-card-foreground shadow-xl border-primary/50">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold text-primary">Check Matin Conducteur</CardTitle>
                        <div className="flex items-center gap-2 text-lg font-mono bg-muted px-3 py-1 rounded-md">
                            <Clock className="h-5 w-5 text-primary" />
                            <span>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
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

                    {/* Pressure Section */}
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

                    {/* Depth Section */}
                    <div className="space-y-3 rounded-md border p-4 bg-background shadow-sm">
                         <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold text-foreground">Profondeur (mm)</Label>
                             <ToggleGroup type="single" value={depthMode} onValueChange={(v: 'rapide' | 'complet') => v && setDepthMode(v)} size="sm">
                                <ToggleGroupItem value="rapide">Rapide</ToggleGroupItem>
                                <ToggleGroupItem value="complet">Complet (I/C/E)</ToggleGroupItem>
                            </ToggleGroup>
                         </div>
                        
                        {depthMode === 'rapide' ? (
                            <div className="space-y-2">
                                <Label htmlFor="d-avg">Profondeur moyenne</Label>
                                <Input id="d-avg" type="number" value={depthValues.inner} onChange={e => setDepthValues({ inner: e.target.value, center: '', outer: ''})} placeholder="Ex: 8.5" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="d-int">Intérieur</Label>
                                    <Input id="d-int" type="number" value={depthValues.inner} onChange={e => setDepthValues(v => ({...v, inner: e.target.value}))} placeholder="I" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="d-cen">Centre</Label>
                                    <Input id="d-cen" type="number" value={depthValues.center} onChange={e => setDepthValues(v => ({...v, center: e.target.value}))} placeholder="C" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="d-ext">Extérieur</Label>
                                    <Input id="d-ext" type="number" value={depthValues.outer} onChange={e => setDepthValues(v => ({...v, outer: e.target.value}))} placeholder="E" />
                                </div>
                            </div>
                        )}
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
