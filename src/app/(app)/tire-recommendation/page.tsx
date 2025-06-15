
"use client";

import { useState } from "react";
import { RecommendationForm } from "@/components/tire-recommendation/recommendation-form";
import { RecommendationResult } from "@/components/tire-recommendation/recommendation-result";
import type { RecommendOptimalTiresOutput } from "@/ai/flows/recommend-optimal-tires";

export default function TireRecommendationPage() {
  const [recommendationData, setRecommendationData] = useState<RecommendOptimalTiresOutput | null>(null);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6 text-center">Module de Recommandation IA : Pneus Optimaux</h2>
        <RecommendationForm onRecommendationResult={setRecommendationData} />
        {recommendationData && <RecommendationResult data={recommendationData} />}
      </div>
    </div>
  );
}
