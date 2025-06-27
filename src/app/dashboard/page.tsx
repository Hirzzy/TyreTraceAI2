
import { Car, Wrench, ShieldAlert, CheckCircle } from "lucide-react";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { PerformanceSummaryChart } from "@/components/dashboard/performance-summary-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { PredictiveAnalysisWidget } from "@/components/dashboard/predictive-analysis-widget";
import { TireListWidget } from "@/components/dashboard/tire-list-widget";
import { PerformanceComparatorWidget } from "@/components/dashboard/performance-comparator-widget";
import { TireTrackingTable } from "@/components/dashboard/tire-tracking-table";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Pneus Suivis"
          value="254"
          Icon={Car}
          description="+2% ce mois-ci"
        />
        <OverviewCard
          title="Pneus Actifs"
          value="231"
          Icon={CheckCircle}
          iconColor="text-green-500"
        />
        <OverviewCard
          title="Alertes Critiques"
          value="3"
          Icon={ShieldAlert}
          iconColor="text-destructive"
          description="Action immédiate requise"
        />
        <OverviewCard
          title="Maintenance Prévue"
          value="12"
          Icon={Wrench}
          iconColor="text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceSummaryChart />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PredictiveAnalysisWidget />
        <PerformanceComparatorWidget />
      </div>

      <div>
        <TireListWidget />
      </div>

      <div>
        <TireTrackingTable />
      </div>
    </div>
  );
}
