
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
  tireId: z.string().min(1, "L'ID du pneu est requis."),
  vehicleType: z.string().min(1, "Le type de véhicule est requis."),
  usagePattern: z.string().min(1, "Le profil d'utilisation est requis."),
  historicalData: z.string().min(1, "Les données historiques sont requises (chaîne JSON)."),
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
      tireId: "",
      vehicleType: "",
      usagePattern: "Ex : Kilométrage autoroutier, conduite en ville, hors-piste",
      historicalData: JSON.stringify({ kilometrage: [10000, 20000, 30000], pression: [100, 98, 95], usure: [1, 2, 3] }, null, 2),
      seasonalFactors: "Ex : Étés chauds, hivers froids avec neige",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onPredictionResult(null); 
    try {
      const input: PredictTireLifespanInput = values;
      const result = await predictTireLifespan(input);
      onPredictionResult(result);
    } catch (error) {
      console.error("Erreur lors de la prédiction de durée de vie:", error);
      toast({
        variant: "destructive",
        title: "Échec de la Prédiction",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
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
                    <FormLabel>ID du Pneu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex : PNEU-001A" {...field} />
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
                      <Input placeholder="Ex : Semi-remorque, Chariot élévateur" {...field} />
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
                  <FormLabel>Profil d'Utilisation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'utilisation typique du véhicule..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ex : Long trajet autoroutier, livraisons urbaines avec arrêts fréquents, chantier de construction hors-piste.
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
                  <FormLabel>Données de Performance Historiques (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "kilometrage": [10000, 20000], "pression": [100, 98], "usure": [1, 2] }'
                      className="resize-y min-h-[100px] font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez une chaîne JSON de données historiques, incluant kilométrage, pression, et usure.
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
                  <FormLabel>Facteurs Saisonniers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les impacts saisonniers..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ex : Chaleur estivale extrême augmentant l'usure, routes hivernales verglacées nécessitant des gommes spécifiques.
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
