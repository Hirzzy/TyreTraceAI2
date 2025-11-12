"use client";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth } from "@/lib/firebaseAuth.client";
import { db } from "@/lib/firebase";
import { toCsv, download, fmtDate, fmtHeure } from "@/lib/exportCsv";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function ExportButtons(){
  async function exportInterventions(){
    const uid = auth.currentUser?.uid!;
    const q = query(collection(db,"events"), where("tenantId","==",uid), orderBy("at","desc"));
    const snap = await getDocs(q);
    const rows = snap.docs.map(d => {
      const e:any = d.data();
      return {
        date: fmtDate(e.at),
        heure: fmtHeure(e.at),
        machine: e.machineName || e.machineId || "",
        type: e.type || "",
        position: e.position || "",
        pneu_id: e.tyreId || "",
        statut_pneu: e.tyreStatus || "",
        notes: e.notes || "",
        event_id: d.id,
      };
    });
    download(`interventions_${new Date().toISOString().slice(0,10)}.csv`, toCsv(rows));
  }

  async function exportStock(){
    const uid = auth.currentUser?.uid!;
    const q = query(collection(db,"tyres"), where("tenantId","==",uid));
    const snap = await getDocs(q);
    const rows = snap.docs.map(d => {
      const t:any = d.data();
      return {
        pneu_id: d.id,
        marque: t.brand || "",
        dimension: t.size || "",
        statut: t.status || "",
        machine_actuelle: t.machineId || "",
        position_actuelle: t.position || "",
        date_maj: fmtDate(t.updatedAt || t.createdAt || Date.now()),
      };
    });
    download(`stock_pneus_${new Date().toISOString().slice(0,10)}.csv`, toCsv(rows));
  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportInterventions} variant="outline"><FileDown className="mr-2 h-4 w-4" />Exporter interventions (CSV)</Button>
      <Button onClick={exportStock} variant="outline"><FileDown className="mr-2 h-4 w-4" />Exporter stock (CSV)</Button>
    </div>
  );
}
