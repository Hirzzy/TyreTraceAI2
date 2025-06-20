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

type TierName = 'essentiel' | 'pro' | 'entreprise';

export default function FeaturesPage() {
  return (
    <div className="bg-background text-foreground py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-primary">Tarifs et Fonctionnalités</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            La solution transparente adaptée à la taille de votre flotte
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choisissez le plan qui correspond à vos ambitions. Que vous soyez une TPE ou une multinationale, nous avons une offre pour vous.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-0 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          {/* Feature Names Column */}
          <div className="col-span-1 p-4 md:p-6 bg-card">
            <h2 className="text-lg font-bold text-foreground h-16 flex items-center">Fonctionnalités</h2>
            <ul className="mt-6 space-y-5">
              {features.map((feature) => (
                <li key={feature.name} className="text-sm font-medium text-muted-foreground h-10 flex items-center">
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Tiers Columns */}
          {(["essentiel", "pro", "entreprise"] as TierName[]).map((tier) => (
            <div
              key={tier}
              className={`p-4 md:p-6 text-center border-l border-border ${tier === "pro" ? "bg-primary/5" : "bg-card"}`}
            >
              <div className="h-16 flex flex-col justify-center">
                <h3 className={`text-lg font-semibold ${tier === "pro" ? "text-primary" : "text-foreground"}`}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier === "essentiel"
                    ? "Pour les TPE/PME"
                    : tier === "pro"
                    ? "Pour les flottes moyennes"
                    : "Pour les grands comptes"}
                </p>
              </div>
              
              <ul className="mt-6 space-y-5">
                {features.map((feature) => (
                  <li key={feature.name} className="h-10 flex items-center justify-center">
                    {feature.tiers[tier] ? (
                      <Check className="h-6 w-6 text-green-500" aria-label="Inclus" />
                    ) : (
                      <X className="h-6 w-6 text-muted-foreground/50" aria-label="Non inclus" />
                    )}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier === 'pro' ? 'default' : 'secondary'}
                className="mt-8 block w-full"
              >
                {tier === "entreprise" ? "Nous Contacter" : `Choisir ${tier.charAt(0).toUpperCase() + tier.slice(1)}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
