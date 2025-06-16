
import { TireDataTable } from "@/components/tire-details/tire-data-table";
import { TireSpecificPerformanceChart } from "@/components/tire-details/tire-specific-performance-chart";
import type { PerformanceMetric } from "@/types";

const mockTirePerformanceData: PerformanceMetric[] = [
  { month: "Janv", mileage: 5200, wearRate: 0.5 },
  { month: "Févr", mileage: 4800, wearRate: 0.45 },
  { month: "Mars", mileage: 5500, wearRate: 0.52 },
  { month: "Avr", mileage: 4500, wearRate: 0.4 },
  { month: "Mai", mileage: 5300, wearRate: 0.48 },
  { month: "Juin", mileage: 5000, wearRate: 0.46 },
];

export default function TireDetailsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Analyse détaillée de la performance des pneus</h2>
      
      <TireSpecificPerformanceChart 
        tireId="T-001" 
        tireName="Michelin XZY3" 
        data={mockTirePerformanceData} 
      />

      <TireDataTable />
    </div>
  );
}
