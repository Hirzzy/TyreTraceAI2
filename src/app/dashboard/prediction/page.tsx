
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { PredictionForm } from "@/components/lifespan-prediction/prediction-form";
import { PredictionResult } from "@/components/lifespan-prediction/prediction-result";
import type { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { RecommendationForm } from '@/components/tire-recommendation/recommendation-form';
import { RecommendationResult } from '@/components/tire-recommendation/recommendation-result';
import type { RecommendOptimalTiresOutput } from '@/ai/flows/recommend-optimal-tires';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function PredictionPage() {
  const [lifespanResult, setLifespanResult] = useState<PredictTireLifespanOutput | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendOptimalTiresOutput | null>(null);

  return (
    <Tabs defaultValue="lifespan" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="lifespan">Prédiction de durée de vie</TabsTrigger>
        <TabsTrigger value="recommendation">Recommandation de Pneus</TabsTrigger>
      </TabsList>
      <TabsContent value="lifespan">
        <Card className="w-full">
          <PredictionForm onPredictionResult={setLifespanResult} />
        </Card>
        {lifespanResult && <PredictionResult data={lifespanResult} />}
      </TabsContent>
      <TabsContent value="recommendation">
        <Card className="w-full">
            <RecommendationForm onRecommendationResult={setRecommendationResult} />
        </Card>
        {recommendationResult && <RecommendationResult data={recommendationResult} />}
      </TabsContent>
    </Tabs>
  );
}
