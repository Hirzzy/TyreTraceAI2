
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendOptimalTiresOutput } from "@/ai/flows/recommend-optimal-tires";
import { Award, Gauge, DollarSign, MessageSquare } from "lucide-react";

interface RecommendationResultProps {
  data: RecommendOptimalTiresOutput | null;
}

export function RecommendationResult({ data }: RecommendationResultProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 mt-6 bg-accent/10 border-accent/30">
      <CardHeader>
         <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-accent" />
          <CardTitle className="text-accent">Résultat de la recommandation de pneu</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">Voici la suggestion de pneu optimal générée par l'IA, basée sur les informations fournies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-background rounded-lg shadow-sm">
          <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary" /> Profil de pneu recommandé
          </h4>
          <p className="text-lg font-bold text-foreground">{data.recommendedTireProfile}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-primary" /> Durée de vie attendue
            </h4>
            <p className="text-lg font-bold text-foreground">{data.expectedLifespan}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" /> Économies de coûts estimées
            </h4>
            <p className="text-lg font-bold text-foreground">{data.estimatedCostSavings}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-primary" /> Raisonnement de l'IA
          </h4>
          <p className="text-sm text-foreground bg-background p-3 rounded-md border">{data.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
