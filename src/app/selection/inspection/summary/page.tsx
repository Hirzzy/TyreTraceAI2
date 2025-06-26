
// src/app/selection/inspection/summary/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VehicleDetailsFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

type TirePosition = '1L' | '1R' | '2L' | '2R';
const TIRE_POSITIONS: TirePosition[] = ['1L', '1R', '2L', '2R'];

type TireInspectionData = {
    depth1: string;
    depth2: string;
    depth3: string;
    pressure: string;
};

type AllTiresData = Record<TirePosition, TireInspectionData>;

// Component for a single tire inspection step
const TireInspectionCard = ({ 
    position,
    data, 
    onChange, 
    onNext, 
    onBack,
    isFirst
}: {
    position: TirePosition,
    data: TireInspectionData,
    onChange: (field: keyof TireInspectionData, value: string) => void,
    onNext: () => void,
    onBack: () => void,
    isFirst: boolean
}) => {
    const isNextDisabled = !data.depth1 || !data.pressure;

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="flex-row items-center">
                <Button variant="ghost" size="icon" onClick={onBack} aria-label="Retour">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="flex-1 text-center">Inspection du pneu ({position})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative mx-auto mb-6 h-36 w-36 rounded-lg border-2 border-dashed border-muted-foreground">
                    <div className="absolute -top-3 -left-3 rounded-md bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
                        {position}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor={`depth1_${position}`}>Profondeur 1 [mm]</Label>
                        <Input type="number" id={`depth1_${position}`} value={data.depth1} onChange={(e) => onChange('depth1', e.target.value)} placeholder="mm (requis)" />
                    </div>
                    <div>
                        <Label htmlFor={`depth2_${position}`}>Profondeur 2 [mm] <span className="text-muted-foreground">(optionnel)</span></Label>
                        <Input type="number" id={`depth2_${position}`} value={data.depth2} onChange={(e) => onChange('depth2', e.target.value)} placeholder="mm" />
                    </div>
                    <div>
                        <Label htmlFor={`depth3_${position}`}>Profondeur 3 [mm] <span className="text-muted-foreground">(optionnel)</span></Label>
                        <Input type="number" id={`depth3_${position}`} value={data.depth3} onChange={(e) => onChange('depth3', e.target.value)} placeholder="mm" />
                    </div>
                    <div>
                        <Label htmlFor={`pressure_${position}`}>Pression mesurée [bar]</Label>
                        <Input type="number" id={`pressure_${position}`} value={data.pressure} onChange={(e) => onChange('pressure', e.target.value)} placeholder="bar (requis)" step="0.1" />
                    </div>
                    <div>
                        <Label htmlFor={`pressure_rec_${position}`}>Pression préconisée [bar]</Label>
                        <Input type="number" id={`pressure_rec_${position}`} value="3.5" readOnly disabled className="bg-slate-100" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-muted/30 p-4">
                <Button onClick={onNext} disabled={isNextDisabled}>Suivant →</Button>
            </CardFooter>
        </Card>
    );
};

// Component for the final summary step
const SummaryCard = ({
    inspectionData,
    onFinish,
    onBack
}: {
    inspectionData: AllTiresData,
    onFinish: () => void,
    onBack: () => void,
}) => (
    <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex-row items-center">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Retour">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="flex-1 text-center">Résumé de l’inspection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {TIRE_POSITIONS.map(pos => (
                <div key={pos} className="border-b pb-2">
                    <h4 className="font-semibold text-primary">Pneu {pos}</h4>
                    <p className="text-sm text-muted-foreground">
                        Profondeur : {inspectionData[pos].depth1 || '-'} / {inspectionData[pos].depth2 || '-'} / {inspectionData[pos].depth3 || '-'} mm
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Pression : {inspectionData[pos].pressure || '-'} bar
                    </p>
                </div>
            ))}
        </CardContent>
        <CardFooter className="flex justify-end bg-muted/30 p-4">
            <Button onClick={onFinish} className="w-full bg-primary hover:bg-primary/90">Valider & envoyer</Button>
        </CardFooter>
    </Card>
);

export default function InspectionWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(0); // 0=1L, 1=1R, 2=2L, 3=2R, 4=summary
    
    const [details, setDetails] = useState<VehicleDetailsFormData | null>(null);
    const [comments, setComments] = useState('');
    const [mileage, setMileage] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    
    const [tiresData, setTiresData] = useState<AllTiresData>({
        '1L': { depth1: '', depth2: '', depth3: '', pressure: '' },
        '1R': { depth1: '', depth2: '', depth3: '', pressure: '' },
        '2L': { depth1: '', depth2: '', depth3: '', pressure: '' },
        '2R': { depth1: '', depth2: '', depth3: '', pressure: '' },
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('vehicleInspectionDetails');
            if (storedData) {
                setDetails(JSON.parse(storedData));
            } else {
                router.push('/selection/type-vehicule');
            }
            const today = new Date();
            setInspectionDate(today.toLocaleDateString('fr-CA')); // YYYY-MM-DD
        } catch (error) {
            console.error("Erreur de lecture du localStorage:", error);
            router.push('/selection/type-vehicule');
        }
    }, [router]);

    const handleDataChange = (position: TirePosition, field: keyof TireInspectionData, value: string) => {
        setTiresData(prev => ({
            ...prev,
            [position]: { ...prev[position], [field]: value }
        }));
    };

    const handleNext = () => setStep(s => Math.min(s + 1, TIRE_POSITIONS.length));
    const handleBack = () => {
        if (step > 0) {
            setStep(s => s - 1);
        } else {
            router.back(); // Go back to details page if on the first step
        }
    };
    
    const handleFinishInspection = () => {
        const fullInspectionData = {
            details,
            inspectionDate,
            mileage,
            tires: tiresData,
            comments,
        };
        console.log("Inspection terminée pour :", fullInspectionData);
        // Here you would save to backend.
        // For now, let's clear localStorage and navigate
        localStorage.removeItem('vehicleInspectionDetails');
        alert('Données d\'inspection envoyées !');
        router.push('/dashboard/vehicles');
    };

    if (!details) {
        return <div className="flex justify-center items-center h-screen"><p>Chargement...</p></div>;
    }

    const currentPosition = TIRE_POSITIONS[step];
    const isSummaryStep = step === TIRE_POSITIONS.length;

    return (
        <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
            {isSummaryStep ? (
                <SummaryCard
                    inspectionData={tiresData}
                    onFinish={handleFinishInspection}
                    onBack={handleBack}
                />
            ) : (
                <TireInspectionCard
                    position={currentPosition}
                    data={tiresData[currentPosition]}
                    onChange={(field, value) => handleDataChange(currentPosition, field, value)}
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirst={step === 0}
                />
            )}
        </div>
    );
}
