
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import type { MockPredictiveDataItem } from "@/types";
import { useEffect, useState } from "react";

const mockPredictiveData: MockPredictiveDataItem[] = [
    { name: 'Jan', usure: 60 }, { name: 'Fév', usure: 55 }, { name: 'Mar', usure: 50 },
    { name: 'Avr', usure: 42 }, { name: 'Mai', usure: 35 }, { name: 'Juin', usure: 28 },
    { name: 'Juil (est.)', usure: 20 }, { name: 'Août (est.)', usure: 10 },
];

const chartConfig = {
  usureReelle: {
    label: "Usure Réelle (mm)",
    color: "hsl(var(--chart-1))",
  },
  prediction: {
    label: "Prédiction Usure (mm)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PredictiveAnalysisWidget() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-[300px] w-full bg-muted rounded-lg animate-pulse"></div>;
  }

  // Prepare data for two lines if needed, or adapt the single line
  const chartData = mockPredictiveData.map(d => ({
    name: d.name,
    usureReelle: d.name.includes("(est.)") ? undefined : d.usure, // Only show real data for past months
    prediction: d.usure, // Show prediction for all months
  }));


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Analyse Prédictive (Dumper A-12)</CardTitle>
        <CardDescription>Évolution de l'usure et prédictions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8}/>
                    <YAxis label={{ value: 'Usure (mm)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickMargin={8}/>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="usureReelle" stroke="var(--color-usureReelle)" strokeWidth={2} name="Usure Réelle" dot={false} />
                    <Line type="monotone" dataKey="prediction" stroke="var(--color-prediction)" strokeDasharray="5 5" name="Prédiction" dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
