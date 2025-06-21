
// src/app/dashboard/page.tsx
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { NewKpiCard } from "@/components/dashboard/new-kpi-card";
import { PerformanceComparatorWidget } from "@/components/dashboard/performance-comparator-widget";
import { PerformanceSummaryChart } from "@/components/dashboard/performance-summary-chart";
import { PredictiveAnalysisWidget } from "@/components/dashboard/predictive-analysis-widget";
import { TireListWidget } from "@/components/dashboard/tire-list-widget";
import { TireTrackingTable } from "@/components/dashboard/tire-tracking-table";
import { AiChatbotWidget } from "@/components/dashboard/ai-chatbot-widget";
import { TrendingUp, Wrench, ShieldAlert, Truck } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <NewKpiCard title="Pneus Actifs" value={258} Icon={Truck} iconContainerClass="bg-blue-100 text-blue-600" />
          <NewKpiCard title="Coût/h Moyen" value="1,42 €" Icon={TrendingUp} iconContainerClass="bg-green-100 text-green-600" />
          <NewKpiCard title="Maintenance Prévue" value={12} Icon={Wrench} iconContainerClass="bg-yellow-100 text-yellow-600" />
          <NewKpiCard title="Alertes Critiques" value={3} Icon={ShieldAlert} iconContainerClass="bg-red-100 text-red-600" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceSummaryChart />
          </div>
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
      <AiChatbotWidget />
    </>
  );
}
