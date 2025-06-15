"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { CheckCircle, TrendingUp, Info } from "lucide-react";

interface PredictionResultProps {
  data: PredictTireLifespanOutput | null;
}

export function PredictionResult({ data }: PredictionResultProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="w-full shadow-md mt-6 bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <CardTitle className="text-primary">Lifespan Prediction Result</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center p-4 bg-background rounded-lg shadow-sm">
          <TrendingUp className="h-8 w-8 text-accent mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Predicted Lifespan</p>
            <p className="text-2xl font-bold text-foreground">
              {data.predictedLifespanMiles.toLocaleString()} miles
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-background rounded-lg shadow-sm">
           <Info className="h-8 w-8 text-accent mr-4" />
           <div>
            <p className="text-sm text-muted-foreground">Confidence Level</p>
            <p className="text-2xl font-bold text-foreground">
              {(data.confidenceLevel * 100).toFixed(1)}%
            </p>
           </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-foreground mb-1">Reasoning:</h4>
          <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border">{data.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
