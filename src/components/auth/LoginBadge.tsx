"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseAuth.client";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginBadge(){
  const [user, setUser] = useState<User | null>(null);
  useEffect(()=>onAuthStateChanged(auth, setUser),[]);

  return (
    <div className="fixed right-4 top-4 z-50">
      <Link href={user ? "/dashboard" : "/auth"}
        className="flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-3 py-1.5 text-sm hover:bg-black hover:text-white transition shadow-md"
        aria-label={user ? "Mon espace" : "Se connecter"}>
        <LogIn className="h-4 w-4" />
        {user ? "Mon espace" : "Se connecter"}
      </Link>
    </div>
  );
}
