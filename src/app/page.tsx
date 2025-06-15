
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Cog, LineChart, BarChartBig, ClipboardCheck, TrendingUp, Archive, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">TyreTrace AI</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#fonctionnalites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Fonctionnalités
            </Link>
            <Link href="#a-propos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              À propos
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              FAQ
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Accéder à l'App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full md:h-[70vh]">
        <Image
          src="https://placehold.co/1920x800.png"
          alt="Camion minier dans une carrière"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          data-ai-hint="quarry truck"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-black/50 to-background p-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Voyez enfin ce que vous <br /> coûte chaque pneu
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Optimisez la gestion de votre flotte et réduisez vos dépenses avec une analyse prédictive de pointe.
          </p>
          <div className="mt-10">
            <Link href="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Démarrer l'analyse
                <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Small Feature Highlights Section */}
      <section id="fonctionnalites" className="py-12 md:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-primary md:mb-4 md:text-4xl">
            Des fonctionnalités pensées pour vous
          </h2>
          <p className="mb-10 text-center text-lg text-muted-foreground md:mb-16">
            Tout ce dont vous avez besoin pour une gestion optimisée de vos pneumatiques.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "Suivi en Temps Réel", description: "Géolocalisation précise et alertes instantanées." , dataAiHint: "map location"},
              { icon: Cog, title: "Optimisation des Opérations", description: "Maintenance prédictive et amélioration de l'efficacité." , dataAiHint: "gear settings"},
              { icon: LineChart, title: "Analyse de Performance", description: "Visualisez vos données pour des décisions éclairées." , dataAiHint: "chart graph"},
              { icon: BarChartBig, title: "Indicateurs Clés (KPI)", description: "Mesurez votre succès et identifiez les points d'amélioration." , dataAiHint: "dashboard metrics"},
            ].map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center bg-card hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: ClipboardCheck, title: "Suivi des Montages", description: "Centralisez l'historique de chaque pneu, de son montage à sa réforme pour une traçabilité complète." },
              { icon: TrendingUp, title: "Gestion de la Performance", description: "Analysez la performance des pneus pour optimiser les choix, anticiper les remplacements et réduire les coûts opérationnels." },
              { icon: Archive, title: "Gestion de Stock Intelligente", description: "Gérez vos stocks de pneus neufs et usagés efficacement pour anticiper les besoins et éviter les ruptures ou surplus." },
            ].map((detail, index) => (
              <div key={index} className="rounded-lg p-6 shadow-lg bg-background border border-border">
                <div className="mb-4 flex items-center gap-3">
                  <detail.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">{detail.title}</h3>
                </div>
                <p className="text-muted-foreground">{detail.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section (Placeholder) */}
      <section id="a-propos" className="py-12 md:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Prêt à transformer la gestion de vos pneus ?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Contactez-nous pour une démonstration personnalisée et découvrez comment TyreTrace AI peut vous aider à économiser.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Demander une démo
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TyreTrace AI. Tous droits réservés.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Politique de confidentialité</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Conditions d'utilisation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

    