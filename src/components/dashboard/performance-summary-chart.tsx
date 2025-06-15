
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const initialChartData = [
  { month: "Jan", activeTires: 186, maintenance: 80 },
  { month: "Feb", activeTires: 205, maintenance: 70 },
  { month: "Mar", activeTires: 237, maintenance: 90 },
  { month: "Apr", activeTires: 173, maintenance: 60 },
  { month: "May", activeTires: 209, maintenance: 75 },
  { month: "Jun", activeTires: 214, maintenance: 85 },
];

const chartConfig = {
  activeTires: {
    label: "Active Tires",
    color: "hsl(var(--chart-1))",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PerformanceSummaryChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-[350px] w-full bg-muted rounded-lg animate-pulse"></div>;
  }
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Overall Performance Summary</CardTitle>
        <CardDescription>Monthly active tires vs. tires undergoing maintenance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={initialChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="activeTires" fill="var(--color-activeTires)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maintenance" fill="var(--color-maintenance)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
