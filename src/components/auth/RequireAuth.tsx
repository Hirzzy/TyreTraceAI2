"use client";
import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseAuth.client";
import { Loader2 } from "lucide-react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => onAuthStateChanged(auth, (u) => {
    if (!u) window.location.href = "/auth"; else setReady(true);
  }), []);
  
  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return <>{children}</>;
}
