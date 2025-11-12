"use client";
import { auth } from "@/lib/firebaseAuth.client";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { weeklyPdf } from "@/lib/exportPdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function ExportWeeklyPdf(){
  async function onClick(){
    const uid = auth.currentUser?.uid!;
    const tenantName = auth.currentUser?.email?.split("@")[0] || "Mon parc";

    const tyresSnap = await getDocs(query(collection(db,"tyres"), where("tenantId","==",uid)));
    const pneusActifs = tyresSnap.docs.filter(d => (d.data() as any).status === "mounted").length;
    const alertes = 5; // placeholder MVP
    const perf = 2.5;  // placeholder MVP

    const eventsSnap = await getDocs(
      query(collection(db,"events"), where("tenantId","==",uid), orderBy("at","desc"), limit(50))
    );
    const events = eventsSnap.docs.map(d => {
      const e:any = d.data();
      return {
        at: e.at,
        machine: e.machineName || e.machineId || "",
        type: e.type || "",
        position: e.position || "",
        tyreId: e.tyreId || "",
      };
    });

    weeklyPdf({ tenantName, kpis:{ pneusActifs, alertes, perf }, events });
  }

  return <Button onClick={onClick}><FileText className="mr-2 h-4 w-4" />Exporter PDF hebdo</Button>;
}
