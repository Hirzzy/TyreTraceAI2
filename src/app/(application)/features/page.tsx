
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Activity, BarChart2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const strengths = [
  { icon: CheckCircle, title: 'Fiabilité accrue', description: 'Suivi précis et continu de l\'état des pneus pour prévenir les pannes.' },
  { icon: Activity, title: 'Maintenance proactive', description: 'Anticipez les besoins en entretien grâce à l\'analyse prédictive.' },
  { icon: BarChart2, title: 'Réduction des coûts', description: 'Optimisez les performances opérationnelles en minimisant les dépenses inutiles.' },
  { icon: Layers, title: 'Gestion simplifiée', description: 'Centralisez toutes les données pneumatiques pour une gestion facilitée.' },
];

const carouselImages = [
    { src: 'https://placehold.co/800x400.png', alt: 'Industrial vehicle in a quarry', hint: 'quarry truck' },
    { src: 'https://placehold.co/800x400.png', alt: 'Close-up of a large tire tread', hint: 'tire tread' },
    { src: 'https://placehold.co/800x400.png', alt: 'Fleet of trucks at a depot', hint: 'truck fleet' },
];

export default function FeaturesPage() {
  const [current, setCurrent] = useState(0);

  const nextImage = () => {
    setCurrent((prevCurrent) => (prevCurrent + 1) % carouselImages.length);
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
       <header>
        <h1 className="text-3xl font-bold text-foreground">Fonctionnalités Clés</h1>
        <p className="text-muted-foreground">Découvrez comment TyreTrace AI transforme la gestion de votre flotte.</p>
      </header>

      {/* Carousel */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative">
            <Image 
                src={carouselImages[current].src} 
                width={800}
                height={400}
                className="w-full h-auto object-cover" 
                alt={carouselImages[current].alt}
                data-ai-hint={carouselImages[current].hint}
            />
            <Button
                onClick={nextImage}
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-2 my-auto h-10 w-10 rounded-full text-white bg-black bg-opacity-30 hover:bg-opacity-50 transition"
                aria-label="Image suivante"
            >
                <ArrowRight />
            </Button>
        </div>
      </Card>


      {/* Start Analysis Button */}
      <div className="text-center">
        <Button size="lg">
          Démarrer l'analyse - 1 véhicule enregistré
        </Button>
      </div>

      {/* Key Strengths */}
      <Card>
        <CardHeader>
            <CardTitle>Nos forces principales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strengths.map((strength) => (
            <div key={strength.title} className="flex items-start gap-4">
                <div className="text-primary flex-shrink-0">
                <strength.icon className="w-8 h-8" />
                </div>
                <div>
                <h3 className="text-lg font-semibold text-foreground">{strength.title}</h3>
                <p className="text-muted-foreground">{strength.description}</p>
                </div>
            </div>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}
