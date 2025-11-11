
'use client';

import { useAuth } from '@/firebase';
import { signInAnonymously, UserCredential } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleAnonymousSignIn = async () => {
        if (!auth) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Le service d\'authentification n\'est pas disponible.',
            });
            return;
        }
        try {
            const userCredential: UserCredential = await signInAnonymously(auth);
            toast({
                title: 'Connexion réussie',
                description: `Connecté en tant qu'utilisateur anonyme ${userCredential.user.uid.substring(0, 6)}...`,
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Erreur de connexion anonyme:", error);
            toast({
                variant: 'destructive',
                title: 'Échec de la connexion',
                description: error.message || 'Une erreur inconnue est survenue.',
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Connexion</CardTitle>
                    <CardDescription>Choisissez une méthode de connexion pour accéder à votre espace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleAnonymousSignIn}>
                        Continuer en tant qu'invité
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
