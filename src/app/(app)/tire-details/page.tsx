import { TireDataTable } from "@/components/tire-details/tire-data-table";
import { TireSpecificPerformanceChart } from "@/components/tire-details/tire-specific-performance-chart";
import type { PerformanceMetric } from "@/types";

// Mock data for a specific tire chart
const mockTirePerformanceData: PerformanceMetric[] = [
  { month: "Jan", mileage: 5200, wearRate: 0.5 },
  { month: "Feb", mileage: 4800, wearRate: 0.45 },
  { month: "Mar", mileage: 5500, wearRate: 0.52 },
  { month: "Apr", mileage: 4500, wearRate: 0.4 },
  { month: "May", mileage: 5300, wearRate: 0.48 },
  { month: "Jun", mileage: 5000, wearRate: 0.46 },
];

export default function TireDetailsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Tire Performance Details</h2>
      
      {/* In a real app, you would select a tire and fetch its data */}
      {/* For now, showing a chart for a mock tire */}
      <TireSpecificPerformanceChart 
        tireId="T-001" 
        tireName="Michelin XZY3" 
        data={mockTirePerformanceData} 
      />

      <TireDataTable />
    </div>
  );
}
