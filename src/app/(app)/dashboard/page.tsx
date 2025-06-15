
import { OverviewCard } from "@/components/dashboard/overview-card";
import { PerformanceSummaryChart } from "@/components/dashboard/performance-summary-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { Activity, AlertOctagon, Wrench, PackageCheck } from "lucide-react";
import { TireTrackingTable } from "@/components/dashboard/tire-tracking-table";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Synthèse des Performances</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Nombre Total de Pneus Actifs"
          value="1,234"
          description="+20.1% depuis le mois dernier"
          Icon={Activity}
        />
        <OverviewCard
          title="Alertes Critiques en Cours"
          value="12"
          description="Nécessitant une attention immédiate"
          Icon={AlertOctagon}
          iconColor="text-destructive"
        />
        <OverviewCard
          title="Maintenances Planifiées"
          value="56"
          description="Interventions de maintenance à venir"
          Icon={Wrench}
          iconColor="text-yellow-500"
        />
        <OverviewCard
          title="État des Pneus : Sains"
          value="95.8%"
          description="Pourcentage de pneus en bon état de fonctionnement"
          Icon={PackageCheck}
          iconColor="text-green-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <PerformanceSummaryChart />
        </div>
        <div className="lg:col-span-3">
          <AlertsPanel />
        </div>
      </div>

      <div>
        <TireTrackingTable />
      </div>
    </div>
  );
}
