
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
import { predictTireLifespan, PredictTireLifespanInput, PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  tireId: z.string().min(1, "L'identifiant du pneu est requis."),
  vehicleType: z.string().min(1, "Le type de véhicule est requis."),
  usagePattern: z.string().min(1, "Le profil d'utilisation est requis."),
  historicalData: z.string().min(1, "Les données historiques sont requises (chaîne JSON valide).").refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: "Le format JSON des données historiques est invalide." }),
  seasonalFactors: z.string().min(1, "Les facteurs saisonniers sont requis."),
});

interface PredictionFormProps {
  onPredictionResult: (data: PredictTireLifespanOutput | null) => void;
}

export function PredictionForm({ onPredictionResult }: PredictionFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tireId: "PNEU-AVD-007",
      vehicleType: "Camion porteur 19T",
      usagePattern: "Principalement autoroute et nationales, charges variables (moy. 10T), conduite économique.",
      historicalData: JSON.stringify({ 
        kilometrage_actuel_km: 75000, 
        pression_moyenne_psi: 110, 
        profondeur_sculpture_actuelle_mm: 6,
        age_pneu_mois: 18,
        nombre_rechapages: 0
      }, null, 2),
      seasonalFactors: "Utilisation intensive en été (fortes chaleurs), moins en hiver mais routes parfois enneigées/salées.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onPredictionResult(null); 
    try {
      const input: PredictTireLifespanInput = values;
      const result = await predictTireLifespan(input);
      onPredictionResult(result);
      toast({
        title: "Prédiction Réussie",
        description: "Les résultats de la prédiction sont affichés ci-dessous.",
      });
    } catch (error) {
      console.error("Erreur lors de la prédiction de durée de vie:", error);
      toast({
        variant: "destructive",
        title: "Échec de la Prédiction",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue lors du traitement de votre demande.",
      });
      onPredictionResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Formulaire de Prédiction de Durée de Vie</CardTitle>
        <CardDesc>Renseignez les informations du pneu pour une estimation IA de sa durée de vie.</CardDesc>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tireId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant Unique du Pneu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PNEU-AVD-007, ID-UNIQUE-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Semi-remorque, Grue mobile, Tracteur agricole" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="usagePattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil d'Utilisation Principal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les conditions typiques d'utilisation du véhicule..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Indiquez le type de trajets (autoroute, ville, chantier), les charges habituelles, et le style de conduite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Données de Performance Antérieures (Format JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "kilometrage_actuel_km": 75000, ... }'
                      className="resize-y min-h-[120px] font-mono text-sm"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez les données de performance clés en format JSON valide. Exemple : 
                    `{"kilometrage_km": 50000, "pression_psi": 100, "usure_mm": 7, "age_mois": 12}`
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seasonalFactors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facteurs Saisonniers et Environnementaux</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les impacts saisonniers ou environnementaux spécifiques..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mentionnez les conditions climatiques (chaleur, froid, neige) et l'état des routes (salées, abrasives) qui influencent l'usure.
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
                  Prédiction en cours...
                </>
              ) : (
                "Prédire la Durée de Vie"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
