
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription as CardDesc, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { recommendOptimalTires, RecommendOptimalTiresInput, RecommendOptimalTiresOutput } from "@/ai/flows/recommend-optimal-tires";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  vehicleType: z.string().min(1, "Le type de véhicule est requis."),
  role: z.string().min(1, "Le rôle du véhicule est requis."),
  historicalTirePerformanceData: z.string().min(1, "Les données historiques sont requises (chaîne JSON)."),
});

interface RecommendationFormProps {
  onRecommendationResult: (data: RecommendOptimalTiresOutput | null) => void;
}

export function RecommendationForm({ onRecommendationResult }: RecommendationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "",
      role: "",
      historicalTirePerformanceData: JSON.stringify({ 
        "donnees": [
          {"profilPneu": "A", "dureeVie": 50000, "cout": 300, "typeVehicule": "Camion", "role": "Long Trajet", "performanceSaisonniere": {"ete": "bonne", "hiver": "moyenne"}},
          {"profilPneu": "B", "dureeVie": 40000, "cout": 250, "typeVehicule": "Camion", "role": "Long Trajet", "performanceSaisonniere": {"ete": "excellente", "hiver": "faible"}}
        ]
      }, null, 2),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onRecommendationResult(null);
    try {
      const input: RecommendOptimalTiresInput = values;
      const result = await recommendOptimalTires(input);
      onRecommendationResult(result);
    } catch (error) {
      console.error("Erreur lors de la recommandation de pneus:", error);
      toast({
        variant: "destructive",
        title: "Échec de la Recommandation",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
      });
      onRecommendationResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Formulaire de Recommandation de Pneus</CardTitle>
        <CardDesc>Indiquez les caractéristiques du véhicule et les données historiques pour des recommandations de pneus assistées par IA.</CardDesc>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex : Camion, Chariot élévateur, Fourgon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle du Véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex : Transport, Chargement, Livraison" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="historicalTirePerformanceData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Données Historiques de Performance des Pneus (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "donnees": [{ "profilPneu": "A", "dureeVie": 50000, ... }] }'
                      className="resize-y min-h-[150px] font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez une chaîne JSON de données historiques sur la performance des pneus, incluant profils, durée de vie, coût, et facteurs saisonniers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recommandation en cours...
                </>
              ) : (
                "Obtenir la Recommandation"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
