
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
  historicalTirePerformanceData: z.string().min(1, "Les données historiques sont requises (chaîne JSON).").refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: "Le format JSON des données historiques est invalide." }),
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
      vehicleType: "Camion de transport régional",
      role: "Livraison de marchandises sur moyennes distances",
      historicalTirePerformanceData: JSON.stringify({
        "analysePneusExistants": [
          {
            "profilPneu": "Michelin X Multi Z",
            "dureeVieMoyenneKm": 120000,
            "coutUnitaireEuro": 450,
            "typeVehiculeConcerne": "Camion porteur 19T",
            "roleVehicule": "Distribution régionale",
            "conditionsUtilisation": "Mixte autoroute et routes secondaires, charges variables.",
            "performanceSaisonniere": {
              "eteSec": "Excellente adhérence, usure modérée",
              "pluie": "Bonne évacuation, sécurité maintenue",
              "neigeVerglas": "Performance limitée, non recommandé pour usage intensif hivernal"
            },
            "incidentsNotables": ["Usure prématurée sur un lot spécifique en 2022", "Bonne résistance aux crevaisons"]
          },
          {
            "profilPneu": "Goodyear KMAX S Gen-2",
            "dureeVieMoyenneKm": 110000,
            "coutUnitaireEuro": 420,
            "typeVehiculeConcerne": "Camion porteur 19T",
            "roleVehicule": "Distribution régionale",
            "conditionsUtilisation": "Principalement routes nationales et départementales, conduite souple.",
            "performanceSaisonniere": {
              "eteSec": "Très bonne performance",
              "pluie": "Adhérence correcte",
              "neigeVerglas": "Adapté pour conditions hivernales légères à modérées"
            },
            "incidentsNotables": ["Moins de plaintes concernant l'usure irrégulière comparé à d'autres modèles"]
          }
        ],
        "contexteOperationnel": {
          "region": "Nord de la France",
          "kilometrageAnnuelMoyenParVehicule": 80000,
          "prioritesFlotte": ["Longévité", "Sécurité toutes saisons", "Coût total de possession (TCO)"]
        }
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
      toast({
        title: "Recommandation Réussie",
        description: "La suggestion de pneu optimal est maintenant disponible.",
      });
    } catch (error) {
      console.error("Erreur lors de la recommandation de pneus:", error);
      toast({
        variant: "destructive",
        title: "Échec de la Recommandation",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue lors du traitement de votre demande.",
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
        <CardDesc>Indiquez les caractéristiques du véhicule et les données de performance antérieures pour obtenir des recommandations de pneus assistées par l'IA.</CardDesc>
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
                    <FormDescription>Indiquez la catégorie ou le modèle du véhicule.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle Principal du Véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex : Transport longue distance, Distribution régionale, Manutention en entrepôt" {...field} />
                    </FormControl>
                    <FormDescription>Décrivez l'usage principal du véhicule.</FormDescription>
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
                  <FormLabel>Données Historiques de Performance des Pneus (Format JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Exemple : { "analysePneusExistants": [{ "profilPneu": "Marque X", "dureeVieMoyenneKm": 100000, ... }], "contexteOperationnel": { ... } }'
                      className="resize-y min-h-[280px] font-code text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez une chaîne JSON structurée avec les données de performance des pneus utilisés précédemment. Incluez des détails tels que le profil, la durée de vie, le coût, le type de véhicule, le rôle, les conditions d'utilisation, et les performances saisonnières.
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
                  Analyse en cours...
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
