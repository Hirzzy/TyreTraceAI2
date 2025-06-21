
"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { name: "Suivi Kilométrique par Pneu", tiers: { essentiel: true, pro: true, entreprise: true } },
  { name: "Gestion des Stocks (Neuf & Rechapé)", tiers: { essentiel: true, pro: true, entreprise: true } },
  { name: "Application Mobile (iOS & Android)", tiers: { essentiel: true, pro: true, entreprise: true } },
  { name: "Rapports d'Activité Standards", tiers: { essentiel: true, pro: true, entreprise: true } },
  { name: "Analyse d'Usure par IA", tiers: { essentiel: false, pro: true, entreprise: true } },
  { name: "Alertes de Maintenance Prédictive", tiers: { essentiel: false, pro: true, entreprise: true } },
  { name: "KPIs de Performance Conducteur", tiers: { essentiel: false, pro: true, entreprise: true } },
  { name: "Tableau de Bord Personnalisable", tiers: { essentiel: false, pro: true, entreprise: true } },
  { name: "Accès API pour Intégration", tiers: { essentiel: false, pro: false, entreprise: true } },
  { name: "Support Technique Dédié", tiers: { essentiel: false, pro: false, entreprise: true } },
  { name: "Formation sur Site", tiers: { essentiel: false, pro: false, entreprise: true } },
];

// Define a type for the tier keys
type Tier = 'essentiel' | 'pro' | 'entreprise';

const tierData: { [key in Tier]: { name: string; description: string; } } = {
  essentiel: { name: "Essentiel", description: "Pour les TPE/PME" },
  pro: { name: "Pro", description: "Pour les flottes moyennes" },
  entreprise: { name: "Entreprise", description: "Pour les grands comptes" },
};

export default function FeaturesPage() {
  return (
    <div className="bg-card py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            La solution transparente adaptée à la taille de votre flotte
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choisissez le plan qui correspond à vos ambitions. Que vous soyez une TPE ou une multinationale, nous avons une offre pour vous.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-0 rounded-lg border border-border shadow-sm">
          <div className="col-span-1 p-4 md:p-6 bg-muted/50 rounded-l-lg">
            <h2 className="text-lg font-bold text-foreground">Fonctionnalités</h2>
            <ul className="mt-6 space-y-5">
              {features.map((feature) => (
                <li key={feature.name} className="text-sm font-medium text-muted-foreground h-10 flex items-center">
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {(Object.keys(tierData) as Tier[]).map((tier, idx) => (
            <div
              key={tier}
              className={`p-4 md:p-6 text-center border-l border-border ${tier === "pro" ? "bg-primary/5" : ""} ${
                idx === 2 ? "rounded-r-lg" : ""
              }`}
            >
              <h3 className={`text-lg font-semibold ${tier === "pro" ? "text-primary" : "text-foreground"}`}>
                {tierData[tier].name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tierData[tier].description}
              </p>
              <ul className="mt-6 space-y-5">
                {features.map((feature) => (
                  <li key={feature.name} className="h-10 flex items-center justify-center">
                    {feature.tiers[tier as keyof typeof feature.tiers] ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <X className="h-6 w-6 text-gray-300" />
                    )}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  tier === "pro" ? "bg-primary hover:bg-primary/90" : "bg-foreground hover:bg-foreground/90 text-background"
                }`}
              >
                {tier === "entreprise" ? "Nous Contacter" : `Choisir ${tierData[tier].name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
