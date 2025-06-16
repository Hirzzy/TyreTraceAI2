
import { BarChart2, AlertTriangle, MapPin } from "lucide-react";
import { NewKpiCard } from "@/components/dashboard/new-kpi-card";
import { PerformanceComparatorWidget } from "@/components/dashboard/performance-comparator-widget";
import { TireListWidget } from "@/components/dashboard/tire-list-widget";
import { PredictiveAnalysisWidget } from "@/components/dashboard/predictive-analysis-widget";
import { AiChatbotWidget } from "@/components/dashboard/ai-chatbot-widget";
import type { MockTire } from "@/types";

// Données simulées (peuvent être déplacées ou chargées dynamiquement)
const mockTires: MockTire[] = [
    { id: 'PNEU-001', vehicle: 'Dumper A-12', site: 'Carrière Est', status: 'ok', wear: 32, cost_h: 1.25, cost_mm: 15.50, brand: 'Michelin' },
    { id: 'PNEU-002', vehicle: 'Chargeuse B-04', site: 'Carrière Est', status: 'surveillance', wear: 18, cost_h: 1.50, cost_mm: 18.75, brand: 'Bridgestone' },
    { id: 'PNEU-003', vehicle: 'Niveleuse C-01', site: 'Chantier Nord', status: 'critique', wear: 8, cost_h: 1.80, cost_mm: 22.50, brand: 'Goodyear' },
];


export default function NewDashboardPage() {
  const kpiData = [
    { title: 'Coût Moyen / Heure', value: `${(mockTires.reduce((acc, t) => acc + t.cost_h, 0) / mockTires.length).toFixed(2)} €`, Icon: BarChart2, iconContainerClass: 'bg-blue-500/10 text-blue-500' },
    { title: 'Pneus en Alerte Critique', value: mockTires.filter(t => t.status === 'critique').length, Icon: AlertTriangle, iconContainerClass: 'bg-destructive/10 text-destructive' },
    { title: 'Sites Actifs', value: new Set(mockTires.map(t => t.site)).size, Icon: MapPin, iconContainerClass: 'bg-green-500/10 text-green-500' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Principal</h1>
        <p className="text-muted-foreground">Bienvenue sur votre plateforme de gestion de pneumatiques.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpiData.map(kpi => <NewKpiCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TireListWidget />
        </div>
        <div>
          <PredictiveAnalysisWidget />
        </div>
        <div className="lg:col-span-3">
          <PerformanceComparatorWidget />
        </div>
      </div>
      <AiChatbotWidget />
    </div>
  );
}
