
"use client";

import { useState } from "react";
import { PredictionForm } from "@/components/lifespan-prediction/prediction-form";
import { PredictionResult } from "@/components/lifespan-prediction/prediction-result";
import type { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { Card } from "@/components/ui/card";

export default function LifespanPredictionPage() {
  const [predictionData, setPredictionData] = useState<PredictTireLifespanOutput | null>(null);

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl text-center">
        <p className="text-muted-foreground mb-6">
          Utilisez ce formulaire pour obtenir une estimation de la durée de vie restante de vos pneus, basée sur l'intelligence artificielle.
        </p>
      </div>
      <Card className="w-full max-w-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <PredictionForm onPredictionResult={setPredictionData} />
      </Card>
      {predictionData && (
        <div className="w-full max-w-3xl">
           <PredictionResult data={predictionData} />
        </div>
      )}
    </div>
  );
}
