// src/app/(selection)/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function SelectionEntryPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoToDashboard = () => {
    setIsModalOpen(false);
    router.push('/dashboard');
  };

  const handleStartNewInspection = () => {
    setIsModalOpen(false);
    router.push('/selection/type-vehicule');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 
                       px-10 py-6 text-xl font-bold rounded-lg 
                       shadow-[0_4px_15px_hsla(var(--primary),0.4)] 
                       hover:translate-y-[-3px] transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Connexion
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background border-2 border-primary text-foreground">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">Choisissez votre destination</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Que souhaitez-vous faire ?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-md"
            >
              Tableau de bord
            </Button>
            <Button
              onClick={handleStartNewInspection}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-md"
            >
              Nouvelle inspection
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full text-foreground hover:bg-accent/80">
                Annuler
                </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
