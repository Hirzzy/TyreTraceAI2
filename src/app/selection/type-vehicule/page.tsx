
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NewInspectionPage() {
  return (
    <div className="container mx-auto py-8">
        <Card>
            <CardHeader>
                <CardTitle>Nouvelle Inspection</CardTitle>
                <CardDescription>Démarrez ici le processus de saisie d'une nouvelle inspection de pneu.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Le formulaire d'inspection et le flux de travail commenceront ici.</p>
                <p>Contenu à venir...</p>
            </CardContent>
        </Card>
    </div>
  );
}
