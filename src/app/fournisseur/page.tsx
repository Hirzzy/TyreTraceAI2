
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FournisseurPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Portail Fournisseur
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Cette section est en cours de construction.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
