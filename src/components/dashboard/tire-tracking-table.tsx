
"use client";

import React, { useEffect, useState } from 'react';
import type { RemplissageFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function TireTrackingTable() {
  const [data, setData] = useState<RemplissageFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("tableauPneus");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de localStorage:", error);
      // Gérer l'erreur, peut-être afficher un message à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Suivi des Pneus (Données de Remplissage)</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p>Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Suivi des Pneus (Données de Remplissage)</CardTitle>
          <CardDescription>Aucune donnée de suivi n'a été trouvée. Remplissez le formulaire pour en ajouter.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculer l'échéance restante en heures et le statut
  const processedData = data.map(item => {
    const echeanceRestanteHeures = item.echeanceHoraire - item.heuresRealisees;
    let statut: 'OK' | 'Proche Échéance' | 'Échu' = 'OK';
    if (echeanceRestanteHeures <= 0) {
      statut = 'Échu';
    } else if (echeanceRestanteHeures <= item.echeanceHoraire * 0.2) { // 20% de l'échéance
      statut = 'Proche Échéance';
    }
    return { ...item, echeanceRestanteHeures, statut };
  });

  const getStatutBadgeVariant = (statut: 'OK' | 'Proche Échéance' | 'Échu') => {
    switch (statut) {
      case 'OK': return 'default'; // Vert (ou bleu par défaut)
      case 'Proche Échéance': return 'secondary'; // Jaune/Orange
      case 'Échu': return 'destructive'; // Rouge
      default: return 'outline';
    }
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Suivi des Pneus (Données de Remplissage)</CardTitle>
        <CardDescription>Liste des pneus saisis via le formulaire de remplissage.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>N° Interne</TableHead>
                <TableHead>Dimension</TableHead>
                <TableHead>Profil Actuel</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">H. Réalisées</TableHead>
                <TableHead className="text-right">Éch. Horaire</TableHead>
                <TableHead className="text-right">H. Restantes</TableHead>
                <TableHead className="text-right">Proj. Final</TableHead>
                <TableHead className="text-right">Éch. Mois</TableHead>
                <TableHead className="text-right">Qté</TableHead>
                <TableHead>Profil Recommandé</TableHead>
                <TableHead>Date Changement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Commentaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.numeroInterne}</TableCell>
                  <TableCell>{item.dimension}</TableCell>
                  <TableCell>{item.profilActuel}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell className="text-right">{item.heuresRealisees}</TableCell>
                  <TableCell className="text-right">{item.echeanceHoraire}</TableCell>
                  <TableCell className="text-right">{item.echeanceRestanteHeures}</TableCell>
                  <TableCell className="text-right">{item.projectionFinal}</TableCell>
                  <TableCell className="text-right">{item.echeanceMois}</TableCell>
                  <TableCell className="text-right">{item.quantite}</TableCell>
                  <TableCell>{item.profilRecommande}</TableCell>
                  <TableCell>{item.dateChangement}</TableCell>
                  <TableCell>
                    <Badge variant={getStatutBadgeVariant(item.statut)}>{item.statut}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.commentaires || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
