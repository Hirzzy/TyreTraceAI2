
"use client";
import { useRouter }from 'next/navigation';
import { useEffect } from 'react';

// Redirect to the new vehicle selection flow
export default function SelectionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/selection/type-vehicule');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <p className="text-muted-foreground">Redirection en cours...</p>
    </div>
  );
}
