
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MockTire } from "@/types";

const mockTires: MockTire[] = [
    { id: 'PNEU-001', vehicle: 'Dumper A-12', site: 'Carrière Est', status: 'ok', wear: 32, cost_h: 1.25, cost_mm: 15.50, brand: 'Michelin' },
    { id: 'PNEU-002', vehicle: 'Chargeuse B-04', site: 'Carrière Est', status: 'surveillance', wear: 18, cost_h: 1.50, cost_mm: 18.75, brand: 'Bridgestone' },
    { id: 'PNEU-003', vehicle: 'Niveleuse C-01', site: 'Chantier Nord', status: 'critique', wear: 8, cost_h: 1.80, cost_mm: 22.50, brand: 'Goodyear' },
    { id: 'PNEU-004', vehicle: 'Dumper A-13', site: 'Carrière Est', status: 'ok', wear: 45, cost_h: 1.30, cost_mm: 14.00, brand: 'Michelin' },
    { id: 'PNEU-005', vehicle: 'Chargeuse B-05', site: 'Chantier Sud', status: 'ok', wear: 50, cost_h: 1.45, cost_mm: 16.50, brand: 'Bridgestone' },
];

export function TireListWidget() {
    const getStatusBadgeVariant = (status: MockTire['status']) => {
        switch (status) {
            case 'ok': return 'default'; // Greenish in default theme or primary
            case 'surveillance': return 'secondary'; // Yellowish
            case 'critique': return 'destructive'; // Red
            default: return 'outline';
        }
    };
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>Traçabilité : Suivi des Pneus</CardTitle>
                <CardDescription>Liste des pneus et leur état actuel.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Pneu</TableHead>
                                <TableHead>Véhicule</TableHead>
                                <TableHead>Site</TableHead>
                                <TableHead className="text-center">Usure (mm Restant)</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTires.slice(0, 5).map(tire => (
                                <TableRow key={tire.id}>
                                    <TableCell className="font-mono text-sm">{tire.id}</TableCell>
                                    <TableCell>{tire.vehicle}</TableCell>
                                    <TableCell>{tire.site}</TableCell>
                                    <TableCell className="text-center">{tire.wear}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusBadgeVariant(tire.status)} className="capitalize">
                                            {tire.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
