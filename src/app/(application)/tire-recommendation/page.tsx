
"use client";

import { useState } from "react";
import { RecommendationForm } from "@/components/tire-recommendation/recommendation-form";
import { RecommendationResult } from "@/components/tire-recommendation/recommendation-result";
import type { RecommendOptimalTiresOutput } from "@/ai/flows/recommend-optimal-tires";
import { Card } from "@/components/ui/card";

export default function TireRecommendationPage() {
  const [recommendationData, setRecommendationData] = useState<RecommendOptimalTiresOutput | null>(null);

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 items-center">
      <div className="w-full max-w-3xl text-center">
        <p className="text-muted-foreground mb-6">
          Obtenez des suggestions de pneus adaptées à vos besoins grâce à notre module de recommandation intelligent.
        </p>
      </div>
      <Card className="w-full max-w-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <RecommendationForm onRecommendationResult={setRecommendationData} />
      </Card>
      {recommendationData && (
        <div className="w-full max-w-3xl">
          <RecommendationResult data={recommendationData} />
        </div>
      )}
    </div>
  );
}
