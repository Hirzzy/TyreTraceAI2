export const dynamic = "force-dynamic"; // empêche la génération statique (SSG)

import { Suspense } from "react";
import DriverCheckClient from "./client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <DriverCheckClient />
    </Suspense>
  );
}
