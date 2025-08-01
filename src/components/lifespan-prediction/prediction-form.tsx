
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
import { CardContent, CardDescription as CardDesc, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Removed Card itself
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
        nombre_rechapages: 0,
        dernier_incident: "Aucun",
        conditions_stockage: "Garage sec et tempéré"
      }, null, 2),
      seasonalFactors: "Utilisation intensive en été (fortes chaleurs), moins en hiver mais routes parfois enneigées/salées. Pneus stockés correctement hors saison.",
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
        title: "Prédiction réussie",
        description: "Les résultats de la prédiction de durée de vie du pneu sont disponibles.",
      });
    } catch (error) {
      console.error("Erreur lors de la prédiction de durée de vie:", error);
      toast({
        variant: "destructive",
        title: "Échec de la prédiction",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue lors du traitement de votre demande. Veuillez vérifier les données et réessayer.",
      });
      onPredictionResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Formulaire de prédiction de durée de vie</CardTitle>
        <CardDesc>Saisissez les informations détaillées du pneu pour obtenir une estimation de sa durée de vie restante, basée sur l'IA.</CardDesc>
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
                    <FormLabel>Identifiant unique du pneu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PNEU-AVD-007, ID-SITE-VEH-POS-01" {...field} />
                    </FormControl>
                    <FormDescription>Code unique assigné à ce pneu spécifique.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Semi-remorque, Grue mobile" {...field} />
                    </FormControl>
                    <FormDescription>Modèle ou catégorie du véhicule utilisant le pneu.</FormDescription>
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
                  <FormLabel>Profil d'utilisation principal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les conditions typiques d'utilisation : type de routes, charges, style de conduite..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ex: "Majoritairement autoroutes (80 %), charges lourdes (30T+), conduite souple, quelques routes régionales (20 %)".
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
                  <FormLabel>Données de performance antérieures (Format JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Exemple : { "kilometrage_actuel_km": 75000, "pression_moyenne_psi": 110, ... }'
                      className="resize-y min-h-[120px] font-mono text-sm"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez les données de performance clés en format JSON. Incluez des métriques comme le kilométrage, la pression, l'usure (profondeur de sculpture), l'âge, etc.
                    <br/>Exemple de structure: <code>{'{ "kilometrage_km": 50000, "pression_psi": 100, "usure_mm": 7, "age_mois": 12, "incidents": ["crevaison mineure"] }'}</code>
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
                  <FormLabel>Facteurs saisonniers et environnementaux</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les impacts saisonniers ou environnementaux : climat, état des routes..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mentionnez les conditions climatiques (chaleur, froid, neige/verglas), l'état des routes (salées, abrasives, dégradées) et leur impact sur l'usure du pneu.
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
                "Prédire la durée de vie"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}
