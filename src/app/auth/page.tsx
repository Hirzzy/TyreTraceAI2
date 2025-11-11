
'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !firestore) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pwd);
      await setDoc(doc(firestore, "users", user.uid), {
        tenantId: user.uid,
        email,
        role: "owner",
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter.",
      });
      setMode("signin");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      router.push("/dashboard");
    } catch (err: any) {
       toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onReset() {
    if (!auth) return;
    if (!email) {
      toast({
        variant: "destructive",
        title: "Champ requis",
        description: "Veuillez entrer votre email pour réinitialiser le mot de passe.",
      });
      return;
    }
    setLoading(true);
    try {
        await sendPasswordResetEmail(auth, email);
        toast({
            title: "Email envoyé",
            description: "Un email de réinitialisation a été envoyé à votre adresse.",
        });
    } catch (err: any) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: err.message,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "signin" | "signup")} className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Se connecter</TabsTrigger>
          <TabsTrigger value="signup">Créer un compte</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>Accédez à votre espace TyreTrace AI.</CardDescription>
            </CardHeader>
             <form onSubmit={onSignIn}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-signin">Email</Label>
                        <Input id="email-signin" type="email" required placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-signin">Mot de passe</Label>
                        <Input id="password-signin" type="password" required placeholder="********" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-4">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Se connecter
                    </Button>
                    <Button type="button" variant="link" onClick={onReset} disabled={loading}>
                        Mot de passe oublié ?
                    </Button>
                </CardFooter>
             </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>Rejoignez TyreTrace AI et commencez à optimiser.</CardDescription>
            </CardHeader>
            <form onSubmit={onSignUp}>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input id="email-signup" type="email" required placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-signup">Mot de passe</Label>
                        <Input id="password-signup" type="password" required placeholder="********" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Créer mon compte
                    </Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
