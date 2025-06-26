// src/app/(selection)/details/[typeVehicule]/[sousType]/page.tsx
"use client";

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Check, ArrowLeft, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EnterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const typeVehiculePath = params.typeVehicule as string;

  // State for display names
  const [displayVehicleType, setDisplayVehicleType] = useState('');
  const [displayVehicleSubType, setDisplayVehicleSubType] = useState('');

  // State for form fields
  const [marque, setMarque] = useState('');
  const [dimension, setDimension] = useState('');
  const [motorisation, setMotorisation] = useState('');
  const [usage, setUsage] = useState('');
  const [pneusOrigine, setPneusOrigine] = useState(false);

  useEffect(() => {
    // Retrieve display names from localStorage
    const storedType = localStorage.getItem('currentVehicleTypeDisplay');
    const storedSubType = localStorage.getItem('currentVehicleSubTypeDisplay');
    
    if (storedType) setDisplayVehicleType(storedType);
    if (storedSubType) setDisplayVehicleSubType(storedSubType);

  }, []);

  const handleSubmit = () => {
    const formData = {
      typeVehicule: displayVehicleType,
      sousType: displayVehicleSubType,
      marque,
      dimension,
      motorisation,
      usage,
      pneusOrigine,
    };
    console.log("Form Data Submitted:", formData);
    alert(`Informations saisies : \n${JSON.stringify(formData, null, 2)}\n\nLa fonctionnalité de sauvegarde sera implémentée ultérieurement.`);
    // Navigate to the next step, for now redirect to selection home
    router.push('/selection');
  };

  const handleBack = () => {
    router.push(`/selection/sous-type/${typeVehiculePath}`);
  };

  const isFormValid = marque && dimension && motorisation && usage;

  return (
    <Card className="w-full max-w-lg bg-card text-card-foreground shadow-xl border-primary/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.3)' }}>
          Saisir les Détails
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Véhicule : <span className="font-semibold text-primary">{displayVehicleType || '...'} - {displayVehicleSubType || '...'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="marque">Marque du véhicule :</Label>
            <Input
              id="marque"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              placeholder="Ex : Caterpillar, Renault, Komatsu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimension">Dimension du pneu :</Label>
            <Input
              id="dimension"
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              placeholder="Ex : 20.5R25, 385/65R22.5"
            />
          </div>

          <div className="space-y-2">
            <Label>Motorisation :</Label>
            <RadioGroup
              value={motorisation}
              onValueChange={setMotorisation}
              className="flex flex-wrap gap-4 pt-1"
            >
              {['Diesel', 'Électrique', 'Hybride', 'Autre'].map(option => (
                 <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`motorisation-${option}`} />
                    <Label htmlFor={`motorisation-${option}`} className="font-normal">{option}</Label>
                 </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="usage">Usage :</Label>
            <Input
              id="usage"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="Chantier, Route, Manutention, etc."
            />
          </div>

          <div className="flex items-center justify-between space-x-2 rounded-md border p-3 shadow-sm bg-background">
             <Label htmlFor="pneus-origine" className="font-medium">Pneus montés à l’origine ?</Label>
             <Switch
                id="pneus-origine"
                checked={pneusOrigine}
                onCheckedChange={setPneusOrigine}
             />
          </div>
        </div>

        <Separator />
        
        <div className="p-3 bg-muted/50 rounded-lg text-center space-y-2">
            <Button variant="outline" disabled className="bg-background">
                <QrCode className="mr-2 h-4 w-4" />
                Générer un QR Code (option)
            </Button>
            <p className="text-xs text-muted-foreground">Option à activer pour liaison future</p>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col-reverse sm:flex-row-reverse gap-3">
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!isFormValid}
          >
            <Check className="mr-2 h-4 w-4" />
            Valider les informations
          </Button>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
      </CardFooter>
    </Card>
  );
}
