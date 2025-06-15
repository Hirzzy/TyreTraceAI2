import { OverviewCard } from "@/components/dashboard/overview-card";
import { PerformanceSummaryChart } from "@/components/dashboard/performance-summary-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { Activity, AlertOctagon, Wrench, PackageCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Performance Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Active Tires"
          value="1,234"
          description="+20.1% from last month"
          Icon={Activity}
        />
        <OverviewCard
          title="Critical Alerts"
          value="12"
          description="Requiring immediate attention"
          Icon={AlertOctagon}
          iconColor="text-destructive"
        />
        <OverviewCard
          title="Maintenance Due"
          value="56"
          description="Upcoming scheduled maintenance"
          Icon={Wrench}
          iconColor="text-yellow-500"
        />
        <OverviewCard
          title="Healthy Tires"
          value="95.8%"
          description="Percentage of tires in good condition"
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

      {/* Placeholder for additional dashboard sections like Recent Activity or Site Performance */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Activity log will be shown here.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
