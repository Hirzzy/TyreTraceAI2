
"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Info, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Alert as AlertType } from "@/types";
import { Separator } from "@/components/ui/separator";

const mockAlerts: AlertType[] = [
  { id: "1", tireId: "T-001", tireName: "Avant Gauche - Camion A2", message: "Pression critiquement basse (20 PSI)", severity: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", tireId: "T-008", tireName: "Arrière Droit - Chariot B1", message: "Profondeur de sculpture approchant la limite (2mm)", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "3", tireId: "T-015", tireName: "Avant Droit - Fourgon C3", message: "Usure anormale détectée sur le bord intérieur.", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "4", tireId: "T-002", tireName: "Avant Droit - Camion A2", message: "Remplacement prévu dans 7 jours.", severity: "info", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "5", tireId: "T-001", tireName: "Avant Gauche - Camion A2", message: "Approche de la fin de vie prévisionnelle.", severity: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },

];

const FormattedTimestamp = ({ timestamp }: { timestamp: string }) => {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setFormattedDate(new Date(timestamp).toLocaleString('fr-FR'));
  }, [timestamp]);

  if (!formattedDate) {
    return <>Chargement...</>; // Ou une valeur par défaut, ou null
  }

  return <>{formattedDate}</>;
};

export function AlertsPanel() {
  const getSeverityIcon = (severity: AlertType['severity']) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <Info className="h-5 w-5 text-yellow-500" />; // Consistance avec OverviewCard
      case "info":
        return <BellRing className="h-5 w-5 text-blue-500" />; // Consistance avec OverviewCard
      default:
        return <BellRing className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadgeVariant = (severity: AlertType['severity']) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary"; 
      case "info":
        return "default"; // Changé d'outline à default pour correspondre aux couleurs d'icônes
      default:
        return "outline";
    }
  }


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Notifications d'Alertes</CardTitle>
        <CardDescription>Liste des alertes nécessitant une attention.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[300px] pr-4">
          {mockAlerts.length > 0 ? (
            <ul className="space-y-4">
              {mockAlerts.map((alert, index) => (
                <li key={alert.id}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-shrink-0 pt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-foreground">{alert.tireName} <span className="text-xs text-muted-foreground">({alert.tireId})</span></p>
                        <Badge variant={getSeverityBadgeVariant(alert.severity)} className="capitalize text-xs">{alert.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground/70">
                        <FormattedTimestamp timestamp={alert.timestamp} />
                      </p>
                    </div>
                  </div>
                  {index < mockAlerts.length - 1 && <Separator className="my-2" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BellRing className="h-12 w-12 mb-2" />
              <p>Aucune alerte active pour le moment.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

