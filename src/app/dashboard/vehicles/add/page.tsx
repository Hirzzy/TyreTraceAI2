
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AddVehiclePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle>Ajouter un véhicule</CardTitle>
          <CardDescription>Cette section est en cours de construction. Le formulaire d'ajout sera implémenté ici.</CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-6">
          <p className="text-muted-foreground mb-6">La page pour ajouter un nouveau véhicule sera bientôt disponible.</p>
          <Link href="/dashboard/vehicles">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste des véhicules
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
