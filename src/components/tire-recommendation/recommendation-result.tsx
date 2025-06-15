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
    <Card className="w-full shadow-md mt-6 bg-accent/10 border-accent/30">
      <CardHeader>
         <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-accent" />
          <CardTitle className="text-accent">Tire Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-background rounded-lg shadow-sm">
          <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary" /> Recommended Tire Profile
          </h4>
          <p className="text-lg font-bold text-foreground">{data.recommendedTireProfile}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-primary" /> Expected Lifespan
            </h4>
            <p className="text-lg font-bold text-foreground">{data.expectedLifespan}</p>
          </div>
          <div className="p-4 bg-background rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" /> Estimated Cost Savings
            </h4>
            <p className="text-lg font-bold text-foreground">{data.estimatedCostSavings}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-primary" /> AI Reasoning
          </h4>
          <p className="text-sm text-foreground bg-background p-3 rounded-md border">{data.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
