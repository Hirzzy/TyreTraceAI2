
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VehicleList } from "@/components/dashboard/vehicle-list";

export default function VehiclesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de la Flotte</CardTitle>
        <CardDescription>Consultez, ajoutez et gérez les véhicules de votre flotte.</CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleList />
      </CardContent>
    </Card>
  );
}
