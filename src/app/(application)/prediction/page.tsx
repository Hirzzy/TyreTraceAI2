
// src/app/(application)/prediction/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { RemplissageFormData } from "@/types" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function PredictionPage() {
  const [donnees, setDonnees] = useState<RemplissageFormData[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    try {
      const data = localStorage.getItem("tableauPneus")
      if (data) {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          setDonnees(parsed)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la lecture des données du localStorage:", error)
    } finally {
      setIsLoading(false);
    }
  }, [])

  const getAlerteBadgeVariant = (alerte: string) => {
    if (alerte.startsWith("🚨")) return "destructive";
    if (alerte.startsWith("⚠️")) return "secondary";
    if (alerte.startsWith("💡")) return "outline";
    return "default";
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex justify-center items-center h-screen">
        <p>Chargement des prédictions en cours...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardDescription>
            Analyse prédictive fondée sur les données d'inspection des pneus enregistrées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donnees.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">Aucune donnée d'inspection de pneu n'est disponible actuellement.</p>
              <p className="text-muted-foreground">Veuillez saisir des données via la page <Button variant="link" onClick={() => router.push('/remplissage')} className="p-0 h-auto">'Nouvelle inspection'</Button> pour afficher les prédictions.</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Machine (N° Interne)</TableHead>
                    <TableHead>Profil Actuel</TableHead>
                    <TableHead className="text-right">Échéance (mois)</TableHead>
                    <TableHead className="text-right">Rendement final prévu (h)</TableHead>
                    <TableHead>Remplacement théorique</TableHead>
                    <TableHead className="text-center">Alertes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donnees.map((item, index) => {
                    const echeanceMoisNum = Number(item.echeanceMois);
                    let alerteMessage = "✅ RAS";
                    let alerteDetails = "";

                    if (isNaN(echeanceMoisNum)) {
                        alerteMessage = "❓ Donnée invalide";
                        alerteDetails = "L'échéance en mois n'est pas un nombre valide.";
                    } else if (echeanceMoisNum <= 1) {
                        alerteMessage = "🚨 Remplacement urgent";
                        alerteDetails = `Échéance critique : ${echeanceMoisNum.toFixed(1)} mois. Action immédiate requise.`;
                    } else if (echeanceMoisNum <= 3) {
                        alerteMessage = "⚠️ À remplacer bientôt";
                        alerteDetails = `Échéance proche : ${echeanceMoisNum.toFixed(1)} mois. Planifier le remplacement.`;
                    } else if (echeanceMoisNum <= 6) {
                        alerteMessage = "💡 Planifier remplacement";
                         alerteDetails = `Échéance à moyen terme : ${echeanceMoisNum.toFixed(1)} mois. Prévoir le remplacement.`;
                    }


                    return (
                      <TableRow key={index}>
                        <TableCell>{item.site}</TableCell>
                        <TableCell>{item.numeroInterne}</TableCell>
                        <TableCell>{item.profilActuel}</TableCell>
                        <TableCell className="text-right">{isNaN(echeanceMoisNum) ? "N/A" : echeanceMoisNum.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{item.projectionFinal}</TableCell>
                        <TableCell>{item.dateChangement}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getAlerteBadgeVariant(alerteMessage)} title={alerteDetails}>
                            {alerteMessage}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => router.push("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
