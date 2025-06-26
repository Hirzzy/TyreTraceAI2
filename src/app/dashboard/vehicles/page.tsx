
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, ArrowUpDown, SlidersHorizontal, Truck, AlertTriangle, ShieldAlert, CircleCheck } from 'lucide-react';
import type { Vehicle } from '@/types';
import { Badge } from '@/components/ui/badge';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    immatriculation: 'GV-128-ZW',
    fleetNumber: 'L506C • 03622',
    context: 'DR PAPREC HAUT DE FRANCE, PAPREC HDF - AMIENS',
    mileage: 38254,
    status: 'attention',
    lastInspectionDate: '19/02/2025',
    activityStatus: 'Actif',
  },
  {
    id: '2',
    immatriculation: 'GL-742-WW',
    fleetNumber: 'H317 • 03131',
    context: 'DR PAPREC IDF, PAPREC IDF - GENNEVILLIERS',
    hours: 2860,
    status: 'ok',
    lastInspectionDate: '05/11/2024',
    activityStatus: 'Actif',
  },
  {
    id: '3',
    immatriculation: 'HJ-555-KL',
    fleetNumber: 'K201A • 04511',
    context: 'DR PAPREC SUD OUEST, PAPREC SUD - BORDEAUX',
    mileage: 95010,
    status: 'urgent',
    lastInspectionDate: '24/09/2024',
    activityStatus: 'Inactif',
  },
  {
    id: '4',
    immatriculation: 'FG-987-CV',
    fleetNumber: 'M812B • 01123',
    context: 'DR PAPREC EST, PAPREC EST - STRASBOURG',
    hours: 5120,
    status: 'ok',
    lastInspectionDate: '15/01/2025',
    activityStatus: 'Actif',
  },
];

const getStatusIcon = (status: Vehicle['status']) => {
  switch (status) {
    case 'ok':
      return <CircleCheck className="h-5 w-5 text-green-500" />;
    case 'attention':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'urgent':
      return <ShieldAlert className="h-5 w-5 text-red-600" />;
    default:
      return null;
  }
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.fleetNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-xl">Gestion de Flotte</CardTitle>
          <Link href="/dashboard/vehicles/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un véhicule
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Recherche : N° d'immat. ou N° de flotte"
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 self-end md:self-center">
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Trier
                </Button>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtrer
                </Button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredVehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/dashboard/vehicles/${vehicle.id}`} passHref>
                    <Card className="p-3 flex flex-col sm:flex-row gap-4 items-center cursor-pointer hover:bg-muted/50 transition-colors duration-200">
                        <Truck className="h-10 w-10 text-primary flex-shrink-0" />
                        <div className="flex-1 text-center sm:text-left">
                        <p className="font-bold text-base">{vehicle.immatriculation} <span className="font-normal text-muted-foreground">• {vehicle.fleetNumber}</span></p>
                        <p className="text-xs text-muted-foreground truncate">{vehicle.context}</p>
                        <div className="flex gap-4 text-xs mt-1 justify-center sm:justify-start text-muted-foreground">
                            {vehicle.mileage && <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>}
                            {vehicle.hours && <span>{vehicle.hours.toLocaleString('fr-FR')} h</span>}
                        </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 sm:items-end flex-shrink-0">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(vehicle.status)}
                                <span className="text-xs text-muted-foreground">Dern. insp. {vehicle.lastInspectionDate}</span>
                            </div>
                        <Badge variant={vehicle.activityStatus === 'Actif' ? 'default' : 'secondary'} className="w-[60px] justify-center">
                            {vehicle.activityStatus}
                        </Badge>
                        </div>
                    </Card>
              </Link>
            ))}
             {filteredVehicles.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Aucun véhicule ne correspond à votre recherche.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
