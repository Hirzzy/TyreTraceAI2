
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HardHat, ChevronsRight, GitBranch, Power, Sprout } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle'; // Updated import path

const mockVehicleData: Vehicle = {
    id: 'V-123456',
    immatriculation: 'IM-5678',
    fleetNumber: 'DUM-01',
    category: 'Génie Civil – Tombereau Rigide',
    brand: 'Caterpillar',
    model: '777G',
    dimension: '27.00R49',
    driveConfig: 'Traction arrière',
    motor: 'Diesel',
    typeSol: ['Roche dure abrasive', 'Sol compact abrasif'],
    status: 'ok',
    lastInspectionDate: '15/05/2024',
    activityStatus: 'Actif',
    precoAxle: { "1": 7.0, "2": 7.5 },
};


export default function VehicleDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            try {
                // In a real app, this would be an API call.
                // For now, we retrieve from localStorage and fallback to mock data.
                const storedVehicles: Vehicle[] = JSON.parse(localStorage.getItem('vehicles') || '[]');
                const foundVehicle = storedVehicles.find(v => v.id === id);
                setVehicle(foundVehicle || mockVehicleData);
            } catch (e) {
                console.error("Failed to load vehicle from localStorage", e);
                setVehicle(mockVehicleData); // Fallback on error
            } finally {
                setIsLoading(false);
            }
        }
    }, [id]);

    if (isLoading) {
        return <div className="p-6">Chargement de la fiche véhicule...</div>;
    }

    if (!vehicle) {
        return <div className="p-6">Véhicule non trouvé.</div>;
    }
    
    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/dashboard/vehicles')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la flotte
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Fiche Véhicule : {vehicle.brand} {vehicle.model}</CardTitle>
                    <CardDescription>N° de flotte: {vehicle.fleetNumber} - {vehicle.immatriculation}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap justify-start items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
                        <Badge variant="secondary" className="text-base flex items-center gap-1"><HardHat size={14} />{vehicle.brand} - {vehicle.model}</Badge>
                        <Badge variant="secondary" className="text-base flex items-center gap-1"><ChevronsRight size={14} />{vehicle.dimension}</Badge>
                        <Badge variant="secondary" className="text-base flex items-center gap-1"><GitBranch size={14} />{vehicle.driveConfig}</Badge>
                        <Badge variant="secondary" className="text-base flex items-center gap-1"><Power size={14} />{vehicle.motor}</Badge>
                        {vehicle.typeSol.map(sol => (
                        <Badge key={sol} variant="secondary" className="text-base flex items-center gap-1"><Sprout size={14} />{sol}</Badge>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Préconisations Pression</h3>
                        <div className="flex gap-4">
                            <div className="p-3 rounded-md border bg-background">
                                <p className="text-sm text-muted-foreground">Essieu 1</p>
                                <p className="text-2xl font-bold text-primary">{vehicle.precoAxle['1'].toFixed(1)} Bar</p>
                            </div>
                            <div className="p-3 rounded-md border bg-background">
                                <p className="text-sm text-muted-foreground">Essieu 2</p>
                                <p className="text-2xl font-bold text-primary">{vehicle.precoAxle['2'].toFixed(1)} Bar</p>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for future components */}
                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Schéma des pneus & KPIs</h3>
                        <p className="text-muted-foreground">Les cartes de statut des pneus, les KPIs détaillés et les graphiques d'historique apparaîtront ici prochainement.</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

