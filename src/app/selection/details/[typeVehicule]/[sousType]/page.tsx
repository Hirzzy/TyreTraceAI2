
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const vehicleBrands = [
  { value: "Caterpillar", label: "Caterpillar" },
  { value: "Komatsu", label: "Komatsu" },
  { value: "Volvo CE", label: "Volvo CE" },
  { value: "Liebherr", label: "Liebherr" },
  { value: "JCB", label: "JCB" },
  { value: "Hitachi", label: "Hitachi" },
  { value: "Doosan / Bobcat", label: "Doosan / Bobcat" },
  { value: "Hyundai Construction", label: "Hyundai Construction" },
  { value: "CASE Construction", label: "CASE Construction" },
  { value: "XCMG", label: "XCMG" },
];

const vehicleModels: Record<string, string[]> = {
  "Komatsu": ["WA 320-8", "WA 270-8", "WA 470-10", "WA 600-8", "P&H L-2350 (WE 2350)", "WA 250-5", "WA 500-8", "WA 380-8", "WA 200-8", "WA 150-5"],
  "Caterpillar": ["926M", "930G", "938G", "950G", "950H", "966H", "994", "994K", "995", "924G"],
  "Volvo CE": ["L90H", "L120H", "L150H", "L110H", "L60H", "L220H", "L180H"],
  "CASE Construction": ["321F", "621G", "821G", "121F", "721G"],
  "Doosan / Bobcat": ["L65", "L75", "L85", "L95", "T770 (skid-steer)"],
  "Liebherr": ["L556 2plus2", "L508 Stereo", "L550", "L538", "L574"],
  "XCMG": ["ZL50GN", "ZL60GN", "ZL40GN"],
  "Hitachi": ["ZW 330-6", "ZW 220-6", "ZW 180-6"],
  "Hyundai Construction": ["HL980", "HL960", "HL955"],
  "Doosan": ["DL580", "DL420"],
};

const tireDimensions = [
  "335/80R18", "365/80R20", "365/70R18", "405/70R20", "12.5/80R18",
  "15.5R25", "17.5R25", "17.5-25 (var. R25)", "20.5R25", "20.5-25",
  "23.5R25", "23.5-25", "26.5R25", "29.5R25", "35/65R33", "40/65R39",
  "45/65R45", "50/65R51", "55.5/80R57", "58/85R57", "875/65R29", "750/65R25"
];

export default function EnterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const typeVehiculePath = params.typeVehicule as string;

  // State for display names
  const [displayVehicleType, setDisplayVehicleType] = useState('');
  const [displayVehicleSubType, setDisplayVehicleSubType] = useState('');

  // State for form fields
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
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
  
  const handleBrandChange = (newBrand: string) => {
    setMarque(newBrand);
    setModele(''); // Reset model when brand changes
  };

  const handleSubmit = () => {
    const formData = {
      typeVehicule: displayVehicleType,
      sousType: displayVehicleSubType,
      marque,
      modele,
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

  const isFormValid = marque && modele && dimension && motorisation && usage;

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
            <Select value={marque} onValueChange={handleBrandChange}>
              <SelectTrigger id="marque">
                <SelectValue placeholder="Sélectionnez une marque" />
              </SelectTrigger>
              <SelectContent>
                {vehicleBrands.map(brand => (
                  <SelectItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modele">Modèle du véhicule :</Label>
            <Select value={modele} onValueChange={setModele} disabled={!marque}>
              <SelectTrigger id="modele">
                <SelectValue placeholder={!marque ? "Sélectionnez d'abord une marque" : "Sélectionnez un modèle"} />
              </SelectTrigger>
              <SelectContent>
                {marque && vehicleModels[marque] ? (
                  vehicleModels[marque].map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucun modèle disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimension">Dimension du pneu :</Label>
            <Select value={dimension} onValueChange={setDimension}>
              <SelectTrigger id="dimension">
                <SelectValue placeholder="Sélectionnez une dimension" />
              </SelectTrigger>
              <SelectContent>
                {tireDimensions.map(dim => (
                  <SelectItem key={dim} value={dim}>
                    {dim}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
