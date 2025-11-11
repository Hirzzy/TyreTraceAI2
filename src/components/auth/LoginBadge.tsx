
"use client";

import Link from "next/link";
import { useUser } from "@/firebase/auth/use-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LayoutDashboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoginBadge() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="absolute right-4 top-4">
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 z-10">
      {user ? (
        <Link href="/dashboard" aria-label="Accéder au tableau de bord">
            <Button variant="outline" className="rounded-full pl-2 pr-4 py-2 h-auto flex items-center gap-2 bg-background/80 backdrop-blur-sm">
                 <Avatar className="h-7 w-7">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'Avatar'} />}
                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Mon Espace</span>
            </Button>
        </Link>
      ) : (
        <Link href="/auth" aria-label="Se connecter">
          <Button variant="default" className="rounded-full pl-3 pr-4 py-2 h-auto flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span className="text-sm font-medium">Se connecter</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
