
"use client";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { PerformanceSummaryChart } from "@/components/dashboard/performance-summary-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { TireListWidget } from "@/components/dashboard/tire-list-widget";
import { PredictiveAnalysisWidget } from "@/components/dashboard/predictive-analysis-widget";
import { PerformanceComparatorWidget } from "@/components/dashboard/performance-comparator-widget";
import { TireTrackingTable } from "@/components/dashboard/tire-tracking-table";
import { NewKpiCard } from "@/components/dashboard/new-kpi-card";

import { Users, Truck, Fuel, Wrench, AlertCircle, TrendingUp, CheckCircle, BarChart2 } from "lucide-react";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NewKpiCard
          title="Pneus Actifs"
          value={248}
          Icon={Truck}
        />
        <NewKpiCard
          title="Alertes Actives"
          value={5}
          Icon={AlertCircle}
          iconContainerClass="bg-destructive/10 text-destructive"
        />
        <NewKpiCard
          title="Performances"
          value="+2.5%"
          Icon={TrendingUp}
          iconContainerClass="bg-green-500/10 text-green-600"
        />
        <NewKpiCard
          title="Inspections OK"
          value="98.7%"
          Icon={CheckCircle}
          iconContainerClass="bg-green-500/10 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceSummaryChart />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
