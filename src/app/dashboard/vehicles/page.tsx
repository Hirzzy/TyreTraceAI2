
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VehicleList } from "@/components/dashboard/vehicle-list";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Véhicules</CardTitle>
          <CardDescription>Consultez, ajoutez et gérez les véhicules de votre flotte. Cliquez sur un véhicule pour voir sa fiche détaillée.</CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleList />
        </CardContent>
      </Card>
    </div>
  );
}
