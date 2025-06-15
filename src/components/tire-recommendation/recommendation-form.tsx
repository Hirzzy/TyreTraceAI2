
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useState, useEffect } from "react";
import { Loader2, UploadCloud, XCircle } from "lucide-react";
import Image from "next/image";

const referenceTireSchema = z.object({
  profile: z.string().min(1, "Le profil du pneu de référence est requis."),
  lifespanKm: z.coerce.number().positive("La durée de vie doit être positive.").optional(),
  costEuro: z.coerce.number().positive("Le coût doit être positif.").optional(),
  usageConditions: z.string().optional(),
  photoDataUri: z.string().optional(), // Sera géré séparément pour le fichier
});

const operationalContextSchema = z.object({
  region: z.string().optional(),
  annualMileagePerVehicleKm: z.coerce.number().positive("Le kilométrage doit être positif.").optional(),
  fleetPriorities: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s) : []), // Transforme une chaîne de priorités séparées par des virgules en tableau
});

const formSchema = z.object({
  vehicleType: z.string().min(1, "Le type de véhicule est requis."),
  role: z.string().min(1, "Le rôle du véhicule est requis."),
  referenceTire: referenceTireSchema.optional(),
  operationalContext: operationalContextSchema.optional(),
  referenceTirePhotoFile: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RecommendationFormProps {
  onRecommendationResult: (data: RecommendOptimalTiresOutput | null) => void;
}

export function RecommendationForm({ onRecommendationResult }: RecommendationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "Camion de transport régional",
      role: "Livraison de marchandises sur moyennes distances",
      referenceTire: {
        profile: "Michelin X Multi Z",
        lifespanKm: 120000,
        costEuro: 450,
        usageConditions: "Mixte autoroute et routes secondaires, charges variables.",
      },
      operationalContext: {
        region: "Nord de la France",
        annualMileagePerVehicleKm: 80000,
        fleetPriorities: ["Longévité", "Sécurité toutes saisons", "Coût total de possession (TCO)"],
      },
    },
  });

  const watchedPhotoFile = form.watch("referenceTirePhotoFile");

  useEffect(() => {
    if (watchedPhotoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(watchedPhotoFile);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhotoFile]);

  const convertFileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    onRecommendationResult(null);

    let photoDataUri: string | undefined = undefined;
    if (values.referenceTirePhotoFile) {
      try {
        photoDataUri = await convertFileToDataUri(values.referenceTirePhotoFile);
      } catch (error) {
        console.error("Erreur de conversion de l'image:", error);
        toast({
          variant: "destructive",
          title: "Erreur Fichier Image",
          description: "Impossible de traiter le fichier image sélectionné.",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const input: RecommendOptimalTiresInput = {
        vehicleType: values.vehicleType,
        role: values.role,
        referenceTire: values.referenceTire ? {
          ...values.referenceTire,
          photoDataUri: photoDataUri,
        } : undefined,
        operationalContext: values.operationalContext ? {
            ...values.operationalContext,
            // fleetPriorities est déjà un tableau grâce à la transformation Zod
            fleetPriorities: values.operationalContext.fleetPriorities as string[] | undefined
        } : undefined,
      };
      
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
        <CardDesc>Indiquez les caractéristiques du véhicule et les détails d'un pneu de référence pour obtenir des recommandations assistées par l'IA.</CardDesc>
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
                      <Input placeholder="Ex : Camion porteur, Tracteur routier" {...field} />
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
                      <Input placeholder="Ex : Transport longue distance, Distribution régionale" {...field} />
                    </FormControl>
                    <FormDescription>Décrivez l'usage principal du véhicule.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card className="p-4 pt-2 bg-muted/30">
              <CardHeader className="px-0 pb-2 pt-2">
                <CardTitle className="text-lg">Détails du Pneu de Référence (Optionnel)</CardTitle>
                <CardDesc className="text-sm">Informations sur un pneu actuellement utilisé ou connu pour comparaison.</CardDesc>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                 <FormField
                  control={form.control}
                  name="referenceTire.profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profil du Pneu de Référence</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Michelin X Multi Z" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referenceTire.lifespanKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée de vie moyenne (km)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="120000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referenceTire.costEuro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coût unitaire (€)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="450" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                <FormField
                  control={form.control}
                  name="referenceTire.usageConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conditions d'utilisation</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex : Mixte autoroute et routes secondaires, charges variables." {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referenceTirePhotoFile"
                  render={({ field: { onChange, value, ...restField } }) => (
                    <FormItem>
                      <FormLabel>Photo du Pneu de Référence</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Cliquez pour choisir</span> ou glissez-déposez</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                            </div>
                            <Input 
                              id="photo-upload" 
                              type="file" 
                              className="hidden" 
                              accept="image/png, image/jpeg, image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    form.setError("referenceTirePhotoFile", { type: "manual", message: "Le fichier est trop volumineux (max 5MB)." });
                                    setPhotoPreview(null);
                                    e.target.value = ""; 
                                  } else {
                                    onChange(file);
                                    form.clearErrors("referenceTirePhotoFile");
                                  }
                                } else {
                                  onChange(undefined); // Clear the file if none is selected
                                }
                              }}
                              {...restField}
                            />
                          </label>
                          {photoPreview && (
                            <div className="relative w-32 h-32 shrink-0 border border-border rounded-md overflow-hidden">
                              <Image src={photoPreview} alt="Aperçu du pneu" layout="fill" objectFit="cover" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 bg-destructive/70 hover:bg-destructive text-destructive-foreground rounded-full"
                                onClick={() => {
                                  form.setValue("referenceTirePhotoFile", undefined);
                                  setPhotoPreview(null);
                                  const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                                  if (fileInput) fileInput.value = "";
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card className="p-4 pt-2 bg-muted/30">
              <CardHeader className="px-0 pb-2 pt-2">
                <CardTitle className="text-lg">Contexte Opérationnel (Optionnel)</CardTitle>
                 <CardDesc className="text-sm">Détails sur l'environnement d'exploitation de la flotte.</CardDesc>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <FormField
                  control={form.control}
                  name="operationalContext.region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Région d'Opération</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Nord de la France, Région montagneuse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operationalContext.annualMileagePerVehicleKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilométrage Annuel Moyen par Véhicule (km)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operationalContext.fleetPriorities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorités de la Flotte</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex : Longévité, Sécurité, Coût" {...field} 
                         onChange={e => field.onChange(e.target.value)} // Zod transform handle array conversion
                         value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Séparez les priorités par une virgule.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>


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
