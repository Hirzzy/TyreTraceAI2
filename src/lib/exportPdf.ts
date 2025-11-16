"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { jsPDF as jsPDFType } from "jspdf";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function weeklyPdf({tenantName, kpis, events}:{ 
  tenantName: string;
  kpis: { pneusActifs: number; alertes: number; perf: number };
  events: Array<{ at:any; machine:string; type:string; position?:string; tyreId?:string }>
}){
  const doc = new jsPDF() as jsPDFType;

  doc.setFontSize(16);
  doc.text(`Compte rendu hebdo – ${tenantName}`, 14, 18);
  doc.setFontSize(11);
  doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 14, 26);

  doc.setFontSize(12);
  doc.text(
    `Pneus actifs: ${kpis.pneusActifs}   Alertes actives: ${kpis.alertes}   Perf: ${kpis.perf}%`,
    14, 36
  );

  const rows = events.map(e => ([
    new Date(e.at?.toDate?.() ?? e.at).toLocaleDateString("fr-FR"),
    e.machine, e.type, e.position ?? "-", e.tyreId ?? "-"
  ]));

  doc.autoTable({
    head: [["Date","Machine","Type","Position","Pneu"]],
    body: rows,
    startY: 44,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] }
  });

  const anyDoc = doc as unknown as {
    getNumberOfPages?: () => number;
    internal?: { pages?: unknown[] };
  };
  
  const pageCount =
    typeof anyDoc.getNumberOfPages === "function"
      ? anyDoc.getNumberOfPages()
      : Math.max(((anyDoc.internal?.pages?.length ?? 1) - 1), 1);

  for (let i=1;i<=pageCount;i++){
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`TyreTrace AI – Rapport hebdo`, 14, 290);
    doc.text(`${i}/${pageCount}`, 200, 290);
  }

  doc.save(`compte-rendu_${new Date().toISOString().slice(0,10)}.pdf`);
}
