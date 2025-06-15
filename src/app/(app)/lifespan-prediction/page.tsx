
"use client";

import { useState } from "react";
import { PredictionForm } from "@/components/lifespan-prediction/prediction-form";
import { PredictionResult } from "@/components/lifespan-prediction/prediction-result";
import type { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";

export default function LifespanPredictionPage() {
  const [predictionData, setPredictionData] = useState<PredictTireLifespanOutput | null>(null);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 text-center">Module de Prédiction IA : Durée de Vie des Pneus</h2>
        <PredictionForm onPredictionResult={setPredictionData} />
        {predictionData && <PredictionResult data={predictionData} />}
      </div>
    </div>
  );
}
