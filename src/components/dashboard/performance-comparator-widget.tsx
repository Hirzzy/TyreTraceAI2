
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MockPerformanceDataItem } from "@/types";

const mockPerformanceData: MockPerformanceDataItem[] = [
    { name: 'Michelin', 'Coût/h (€)': 1.28, 'Durée de vie (h)': 4500, 'Score': '🥇' },
    { name: 'Bridgestone', 'Coût/h (€)': 1.48, 'Durée de vie (h)': 4100, 'Score': '🥈' },
    { name: 'Goodyear', 'Coût/h (€)': 1.80, 'Durée de vie (h)': 3800, 'Score': '🥉' },
];

export function PerformanceComparatorWidget() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Aide à la décision : Comparateur de performance</CardTitle>
        <CardDescription>Analyse comparative des marques de pneus.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marque</TableHead>
                <TableHead className="text-center">Coût / h (€)</TableHead>
                <TableHead className="text-center">Durée de vie (h)</TableHead>
                <TableHead className="text-center">Score Rentabilité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPerformanceData.map(item => (
                <TableRow key={item.name}>
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell className="text-center">{item['Coût/h (€)'].toFixed(2)}</TableCell>
                  <TableCell className="text-center">{item['Durée de vie (h)']}</TableCell>
                  <TableCell className="text-center text-2xl">{item.Score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
