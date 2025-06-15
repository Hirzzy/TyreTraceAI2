"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { PerformanceMetric } from "@/types";
import { useEffect, useState } from "react";

interface TireSpecificPerformanceChartProps {
  tireId: string;
  tireName: string;
  data: PerformanceMetric[];
}

const chartConfig = {
  mileage: {
    label: "Mileage (km)",
    color: "hsl(var(--chart-1))",
  },
  wearRate: {
    label: "Wear Rate (mm/1k km)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TireSpecificPerformanceChart({ tireId, tireName, data }: TireSpecificPerformanceChartProps) {
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
        <CardTitle>Performance: {tireName} <span className="text-sm text-muted-foreground">({tireId})</span></CardTitle>
        <CardDescription>Monthly mileage and wear rate over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-mileage)" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-wearRate)" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="mileage" stroke="var(--color-mileage)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="wearRate" stroke="var(--color-wearRate)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
