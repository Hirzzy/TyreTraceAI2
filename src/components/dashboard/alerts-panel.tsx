"use client";

import { AlertTriangle, Info, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Alert as AlertType } from "@/types";
import { Separator } from "@/components/ui/separator";

const mockAlerts: AlertType[] = [
  { id: "1", tireId: "T-001", tireName: "Front Left - Truck A2", message: "Pressure critically low (20 PSI)", severity: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", tireId: "T-008", tireName: "Rear Right - Forklift B1", message: "Tread depth approaching limit (2mm)", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "3", tireId: "T-015", tireName: "Front Right - Van C3", message: "Unusual wear pattern detected on inner edge.", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "4", tireId: "T-002", tireName: "Front Right - Truck A2", message: "Scheduled for replacement in 7 days.", severity: "info", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "5", tireId: "T-001", tireName: "Front Left - Truck A2", message: "Approaching predicted end-of-life.", severity: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },

];

export function AlertsPanel() {
  const getSeverityIcon = (severity: AlertType['severity']) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <BellRing className="h-5 w-5 text-blue-500" />;
      default:
        return <BellRing className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadgeVariant = (severity: AlertType['severity']) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary"; // Using secondary for warning for better contrast on light bg
      case "info":
        return "default"; // Using primary for info
      default:
        return "outline";
    }
  }


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Critical Alerts</CardTitle>
        <CardDescription>Immediate attention required for these tires.</CardDescription>
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
                      <p className="text-xs text-muted-foreground/70">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  {index < mockAlerts.length - 1 && <Separator className="my-2" />}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BellRing className="h-12 w-12 mb-2" />
              <p>No active alerts.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
