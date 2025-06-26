"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige vers le début du parcours de sélection du véhicule.
    router.replace('/selection/type-vehicule');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirection vers le portail d'inspection...</p>
    </div>
  );
}
