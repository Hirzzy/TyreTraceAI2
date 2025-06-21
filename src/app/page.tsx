
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
            <Image
              src="https://placehold.co/120x32.png"
              alt="TyreTrace AI Logo"
              width={120}
              height={32}
              className="object-contain"
              data-ai-hint="logo brand"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#fonctionnalites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Fonctionnalités
            </Link>
            <Link href="#a-propos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              À Propos
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              FAQ
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/selection">
                <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                TABLEAU DE BORD
                </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full md:h-[70vh]">
        <Image
          src="https://placehold.co/1920x800.png"
          alt="Camion minier dans une carrière"
          fill
          className="opacity-20 object-cover"
          data-ai-hint="quarry truck"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-black/50 to-background p-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Visualisez enfin le coût réel de chaque pneu
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
      <section id="fonctionnalites" className="py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-primary md:mb-4 md:text-4xl">
            Des fonctionnalités pensées pour vous
          </h2>
          <p className="mb-10 text-center text-lg text-muted-foreground md:mb-16">
            Tout ce dont vous avez besoin pour une gestion optimisée de vos pneumatiques.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "Suivi en temps réel", description: "Géolocalisation précise et alertes instantanées pour une réactivité maximale." , dataAiHint: "map location"},
              { icon: Cog, title: "Optimisation des opérations", description: "Maintenance prédictive et amélioration continue de l'efficacité opérationnelle." , dataAiHint: "gear settings"},
              { icon: LineChart, title: "Analyse de performance", description: "Visualisez vos données clés pour prendre des décisions stratégiques éclairées." , dataAiHint: "chart graph"},
              { icon: BarChartBig, title: "Indicateurs clés (KPI)", description: "Mesurez votre succès et identifiez les opportunités d'amélioration continue." , dataAiHint: "dashboard metrics"},
            ].map((feature, index) => (
              <Card key={index} className="bg-card hover:shadow-xl transition-shadow duration-300">
                <CardContent className="flex flex-col items-center text-center gap-4 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section id="a-propos" className="py-12 md:py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: ClipboardCheck, title: "Suivi complet des montages", description: "Centralisez l'historique de chaque pneu, de son montage à sa réforme, pour une traçabilité intégrale et fiable." },
              { icon: TrendingUp, title: "Gestion avancée de la performance", description: "Analysez la performance des pneus pour optimiser les choix, anticiper les remplacements et réduire significativement les coûts opérationnels." },
              { icon: Archive, title: "Gestion de stock intelligente", description: "Gérez efficacement vos stocks de pneus neufs et usagés pour anticiper les besoins et éviter les ruptures ou les surplus coûteux." },
            ].map((detail, index) => (
              <div key={index} className="flex flex-col items-center text-center rounded-lg p-6 shadow-lg bg-background border border-border">
                <div className="mb-4 text-primary">
                  <detail.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{detail.title}</h3>
                <p className="text-muted-foreground">{detail.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Innovative Technology Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-2 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Innovation
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Notre technologie au service de vos pneus
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                TyreTrace AI intègre des algorithmes d'intelligence artificielle avancés pour analyser des milliers de points de données,
                offrant des prédictions précises et des recommandations personnalisées. Notre plateforme vous aide à anticiper les
                besoins de maintenance, à optimiser le cycle de vie de chaque pneu et à prendre des décisions basées sur des informations concrètes.
              </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Illustration de technologie innovante pour la gestion des pneus"
                width={600}
                height={400}
                className="h-full w-full object-cover"
                data-ai-hint="future tech"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="contact" className="py-12 md:py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Prêt à transformer la gestion de vos pneus ?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Contactez-nous pour une démonstration personnalisée et découvrez comment TyreTrace AI peut vous aider à réaliser des économies substantielles.
          </p>
          <div className="mt-8">
            <Link href="/dashboard"> {/* Temporairement vers le dashboard, idéalement vers une page contact/démo */}
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Demander une démo
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="faq" className="border-t border-border bg-background py-8 text-center">
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
    

    
