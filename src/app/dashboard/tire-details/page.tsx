
import { TireDataTable } from "@/components/tire-details/tire-data-table";
import { TireSpecificPerformanceChart } from "@/components/tire-details/tire-specific-performance-chart";
import type { PerformanceMetric } from "@/types";

const mockPerformanceData: PerformanceMetric[] = [
  { month: "Jan", mileage: 5000, wearRate: 0.5 },
  { month: "Feb", mileage: 10000, wearRate: 0.52 },
  { month: "Mar", mileage: 15000, wearRate: 0.51 },
  { month: "Apr", mileage: 20000, wearRate: 0.55 },
  { month: "May", mileage: 25000, wearRate: 0.54 },
  { month: "Jun", mileage: 30000, wearRate: 0.56 },
];

export default function TireDetailsPage() {
  return (
    <div className="space-y-6">
      <TireSpecificPerformanceChart 
        tireId="T-001"
        tireName="Michelin XZY3"
        data={mockPerformanceData}
      />
      <TireDataTable />
    </div>
  );
}
