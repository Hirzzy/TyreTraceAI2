
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, Construction, Car, Tractor } from 'lucide-react';
import { cn } from "@/lib/utils";

const vehicleTypes = [
  { name: "Poids Lourd", description: "Camions, tracteurs, etc.", icon: Truck, category: 'poids-lourd' },
  { name: "Génie Civil", description: "Chargeuses, dumpers, etc.", icon: Construction, category: 'genie-civil' },
  { name: "Utilitaire", description: "Fourgonnettes, camionnettes, etc.", icon: Car, category: 'utilitaire' },
  { name: "Agricole", description: "Tracteurs, moissonneuses, etc.", icon: Tractor, category: 'agricole' },
];

export function VehicleTypeSelection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vehicleTypes.map((vehicle) => (
        <Card 
            key={vehicle.category} 
            className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200"
            onClick={() => alert(`Sélectionné : ${vehicle.name}`)}
        >
          <CardHeader className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <vehicle.icon className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>{vehicle.name}</CardTitle>
            <CardDescription>{vehicle.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
