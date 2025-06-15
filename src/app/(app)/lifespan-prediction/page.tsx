
"use client";

import { useState } from "react";
import { PredictionForm } from "@/components/lifespan-prediction/prediction-form";
import { PredictionResult } from "@/components/lifespan-prediction/prediction-result";
import type { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";

export default function LifespanPredictionPage() {
  const [predictionData, setPredictionData] = useState<PredictTireLifespanOutput | null>(null);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Module de Prédiction IA : Durée de Vie des Pneus</h2>
        <p className="text-muted-foreground mb-6">
          Utilisez ce formulaire pour obtenir une estimation de la durée de vie restante de vos pneus, basée sur l'intelligence artificielle.
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <PredictionForm onPredictionResult={setPredictionData} />
        {predictionData && <PredictionResult data={predictionData} />}
      </div>
    </div>
  );
}
