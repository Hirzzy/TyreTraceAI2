
// app/(application)/remplissage/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CardDesc, CardFooter } from "@/components/ui/card"
import type { RemplissageFormData } from "@/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  site: z.string().min(1, "Le site est requis."),
  numeroInterne: z.string().min(1, "Le N° interne du véhicule est requis."),
  heure2024: z.coerce.number().min(0, "Les heures machine doivent être un nombre positif."),
  heure2025: z.coerce.number().min(0, "Les heures machine doivent être un nombre positif."),
  dimension: z.string().min(1, "La dimension du pneu est requise."),
  profilActuel: z.string().min(1, "Le profil actuel du pneu est requis."),
  position: z.string().min(1, "La position du pneu est requise."),
  heuresRealisees: z.coerce.number().min(0, "Les heures réalisées doivent être un nombre positif."),
  echeanceHoraire: z.coerce.number().min(0, "L'échéance horaire machine doit être un nombre positif."),
  projectionFinal: z.coerce.number().min(0, "La projection du rendement final doit être un nombre positif."),
  echeanceMois: z.coerce.number().min(0, "L'échéance en mois doit être un nombre positif."),
  quantite: z.coerce.number().min(1, "La quantité de pneus concernés doit être d'au moins 1."),
  profilRecommande: z.string().min(1, "Le profil de pneu recommandé est requis."),
  dateChangement: z.string().regex(/^\d{4}-\d{2}$/, "Le format AAAA-MM est requis pour la date de changement."), 
  commentaires: z.string().optional(),
})

export default function RemplissagePage() {
  const form = useForm<RemplissageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site: "",
      numeroInterne: "",
      heure2024: 0,
      heure2025: 0,
      dimension: "",
      profilActuel: "",
      position: "",
      heuresRealisees: 0,
      echeanceHoraire: 0,
      projectionFinal: 0,
      echeanceMois: 0,
      quantite: 1,
      profilRecommande: "",
      dateChangement: "",
      commentaires: "",
    }
  })
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = (data: RemplissageFormData) => {
    try {
      const tableau = JSON.parse(localStorage.getItem("tableauPneus") || "[]")
      tableau.push(data)
      localStorage.setItem("tableauPneus", JSON.stringify(tableau))
      toast({
        title: "Succès",
        description: "Données de l'inspection enregistrées avec succès.",
      })
      router.push("/dashboard") 
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans localStorage:", error)
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: "Impossible d'enregistrer les données de l'inspection.",
      })
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardDesc>Complétez les champs ci-dessous pour enregistrer les données d'une nouvelle inspection de pneu.</CardDesc>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="site" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <FormControl><Input placeholder="Nom du site" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="numeroInterne" render={({ field }) => (
                <FormItem>
                  <FormLabel>N° interne véhicule</FormLabel>
                  <FormControl><Input placeholder="Ex: T001, Chariot 5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="heure2024" render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures machine 2024</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="heure2025" render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures machine 2025</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="dimension" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimension pneu</FormLabel>
                  <FormControl><Input placeholder="Ex: 295/80R22.5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="profilActuel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil actuel du pneu</FormLabel>
                  <FormControl><Input placeholder="Ex: Michelin XZY3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem>
                  <FormLabel>Position du pneu</FormLabel>
                  <FormControl><Input placeholder="Ex: AVG (Avant Gauche)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="heuresRealisees" render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures réalisées par le pneu</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="echeanceHoraire" render={({ field }) => (
                <FormItem>
                  <FormLabel>Échéance horaire machine</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="projectionFinal" render={({ field }) => (
                <FormItem>
                  <FormLabel>Projection rendement final (heures)</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="echeanceMois" render={({ field }) => (
                <FormItem>
                  <FormLabel>Échéance en mois</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="quantite" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité (pneus concernés)</FormLabel>
                  <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="profilRecommande" render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil de pneu recommandé</FormLabel>
                  <FormControl><Input placeholder="Ex: Goodyear KMAX S" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="dateChangement" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de changement théorique</FormLabel>
                  <FormControl><Input type="month" placeholder="AAAA-MM" {...field} /></FormControl>
                  <FormDescription>Format AAAA-MM (ex: 2024-12).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="commentaires" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Commentaires (optionnel)</FormLabel>
                  <FormControl><Textarea placeholder="Ajoutez des commentaires, notes ou observations spécifiques ici..." {...field} className="resize-none" rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Enregistrement en cours..." : "Enregistrer l'inspection"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
