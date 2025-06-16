
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { CheckCircle, TrendingUp, Info, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictionResultProps {
  data: PredictTireLifespanOutput | null;
}

export function PredictionResult({ data }: PredictionResultProps) {
  if (!data) {
    return null;
  }

  const confidencePercentage = Math.round(data.confidenceLevel * 100);

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 mt-8 mb-8 bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="h-7 w-7 text-primary" />
          <CardTitle className="text-primary text-2xl">Résultats de la prédiction</CardTitle>
        </div>
        <CardDescription>L'IA a analysé les données fournies pour estimer la durée de vie du pneu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-background rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-6 w-6 text-accent mr-3" />
            <h3 className="text-lg font-semibold text-foreground">Durée de vie prédite</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {data.predictedLifespanMiles.toLocaleString('fr-FR')} miles
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Estimation du kilométrage restant avant remplacement.
          </p>
        </div>

        <div className="p-4 bg-background rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
             <Percent className="h-6 w-6 text-accent mr-3" />
             <h3 className="text-lg font-semibold text-foreground">Niveau de confiance</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <Progress value={confidencePercentage} aria-label={`${confidencePercentage}% de confiance`} className="w-full h-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{confidencePercentage}% de confiance dans cette prédiction.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-right text-sm font-medium text-foreground mt-1">{confidencePercentage}%</p>
           <p className="text-sm text-muted-foreground mt-1">
            Indique la fiabilité de l'estimation de l'IA.
          </p>
        </div>
        
        <div className="p-4 bg-background rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-2">
            <Info className="h-6 w-6 text-accent mr-3" />
            <h3 className="text-lg font-semibold text-foreground">Raisonnement de l'IA</h3>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
