
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VehicleTypeSelection } from "@/components/inspection/vehicle-type-selection";

export default function TypeVehiculePage() {
  return (
    <div className="container mx-auto py-8">
        <Card>
            <CardHeader>
                <CardTitle>Nouvelle Inspection : Étape 1</CardTitle>
                <CardDescription>Veuillez sélectionner le type de véhicule à inspecter pour commencer.</CardDescription>
            </CardHeader>
            <CardContent>
                <VehicleTypeSelection />
            </CardContent>
        </Card>
    </div>
  );
}
