
// app/(app)/remplissage/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import type { RemplissageFormData } from "@/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  site: z.string().min(1, "Le site est requis."),
  numeroInterne: z.string().min(1, "Le N° interne est requis."),
  heure2024: z.coerce.number().min(0, "Les heures doivent être positives."),
  heure2025: z.coerce.number().min(0, "Les heures doivent être positives."),
  dimension: z.string().min(1, "La dimension est requise."),
  profilActuel: z.string().min(1, "Le profil actuel est requis."),
  position: z.string().min(1, "La position est requise."),
  heuresRealisees: z.coerce.number().min(0, "Les heures doivent être positives."),
  echeanceHoraire: z.coerce.number().min(0, "L'échéance horaire doit être positive."),
  projectionFinal: z.coerce.number().min(0, "La projection doit être positive."),
  echeanceMois: z.coerce.number().min(0, "L'échéance en mois doit être positive."),
  quantite: z.coerce.number().min(1, "La quantité doit être d'au moins 1."),
  profilRecommande: z.string().min(1, "Le profil recommandé est requis."),
  dateChangement: z.string().regex(/^\d{4}-\d{2}$/, "Format YYYY-MM requis."), // format : YYYY-MM
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
        description: "Données enregistrées avec succès.",
      })
      router.push("/dashboard") // redirige vers ton dashboard
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans localStorage:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les données.",
      })
    }
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nouveau Suivi Pneumatique</CardTitle>
          <CardDescription>Remplissez les informations ci-dessous pour ajouter un nouveau suivi.</CardDescription>
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
                  <FormControl><Input placeholder="Ex: T001" {...field} /></FormControl>
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
                  <FormLabel>Profil actuel</FormLabel>
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
                  <FormLabel>Heures réalisées</FormLabel>
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
                  <FormLabel>Profil recommandé</FormLabel>
                  <FormControl><Input placeholder="Ex: Goodyear KMAX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="dateChangement" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date changement théorique</FormLabel>
                  <FormControl><Input type="month" placeholder="YYYY-MM" {...field} /></FormControl>
                  <FormDescription>Format AAAA-MM (ex: 2024-12).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="commentaires" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Commentaires (optionnel)</FormLabel>
                  <FormControl><Textarea placeholder="Ajoutez des commentaires ou notes ici..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer le suivi"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
