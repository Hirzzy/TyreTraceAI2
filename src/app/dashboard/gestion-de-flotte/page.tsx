
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection, query, where, orderBy, limit, getDocs, startAfter,
  updateDoc, doc, DocumentSnapshot
} from "firebase/firestore";
import { db } from "@/firebase";
import { auth } from "@/lib/firebaseAuth.client"; // Utilisation directe pour UID
import { download, toCsv, fmtDate } from "@/lib/exportCsv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileDown, PlusCircle } from "lucide-react";
import { useUser } from "@/firebase/auth/use-user";

type Tyre = {
  id: string;
  tenantId: string;
  brand?: string;
  size?: string;
  status: "stock" | "mounted" | "removed";
  machineId?: string | null;
  machineName?: string | null;
  position?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

const PAGE_SIZE = 20;

export default function StockPneusPage() {
  const { user } = useUser();
  const [status, setStatus] = useState<"stock" | "mounted" | "removed" | "all">("stock");
  const [rows, setRows] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const uid = user?.uid;

  async function fetchPage(reset = false) {
    if (!uid) return;
    setLoading(true);

    const baseConditions = [where("tenantId", "==", uid)];
    if (status !== "all") {
      baseConditions.push(where("status", "==", status));
    }

    const q = query(
      collection(db, "tyres"),
      ...baseConditions,
      orderBy("updatedAt", "desc"),
      ...(reset || !cursor ? [] : [startAfter(cursor)]),
      limit(PAGE_SIZE)
    );

    try {
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Tyre[];
        setRows(prev => reset ? docs : [...prev, ...docs]);
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
    } catch (error) {
        console.error("Erreur Firestore (pensez à créer l'index composite !) : ", error);
        // Idéalement, afficher un toast ici
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (uid) {
      setRows([]);
      setCursor(null);
      fetchPage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, uid]);

  async function deposer(t: Tyre) {
    await updateDoc(doc(db, "tyres", t.id), {
      status: "stock",
      machineId: null,
      machineName: null,
      position: null,
      updatedAt: new Date()
    });
    setRows(prev => prev.map(p => p.id === t.id ? { ...p, status: "stock", machineId: null, machineName: null, position: null } : p));
  }

  async function archiver(t: Tyre) {
    await updateDoc(doc(db, "tyres", t.id), { status: "removed", updatedAt: new Date() });
    setRows(prev => prev.filter(p => p.id !== t.id));
  }

  async function exportStockCsv() {
    if (!uid) return;
    const baseConditions = [where("tenantId", "==", uid)];
    if (status !== "all") {
      baseConditions.push(where("status", "==", status));
    }
    const qAll = query(collection(db, "tyres"), ...baseConditions, orderBy("updatedAt", "desc"), limit(1000));
    
    const snap = await getDocs(qAll);
    const data = snap.docs.map(d => {
      const t: any = d.data();
      return {
        pneu_id: d.id,
        marque: t.brand || "",
        dimension: t.size || "",
        statut: t.status || "",
        machine: t.machineName || t.machineId || "",
        position: t.position || "",
        derniere_maj: fmtDate(t.updatedAt || t.createdAt || Date.now())
      };
    });
    download(`stock_${status}_${new Date().toISOString().slice(0,10)}.csv`, toCsv(data));
  }

  const title = useMemo(() => {
    const map: Record<typeof status, string> = { stock: "Stock disponible", mounted: "Pneus montés", removed: "Pneus archivés", all: "Tous les pneus" };
    return map[status];
  }, [status]);

  const statusMap: Record<Tyre['status'], { variant: "default" | "secondary" | "destructive" | "outline" | null | undefined, label: string }> = {
    stock: { variant: "default", label: "En stock" },
    mounted: { variant: "secondary", label: "Monté" },
    removed: { variant: "outline", label: "Archivé" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion de flotte • {title}</h1>
        <div className="flex gap-2">
          <Button onClick={exportStockCsv} variant="outline">
            <FileDown className="mr-2" />
            Exporter (CSV)
          </Button>
          <Link href="/driver/check">
            <Button>
              <PlusCircle className="mr-2" />
              Encodage express
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["stock", "mounted", "removed", "all"] as const).map(s => (
          <Button key={s}
                  onClick={() => setStatus(s)}
                  variant={status === s ? "default" : "outline"}>
            {s === "stock" && "Stock"}
            {s === "mounted" && "Montés"}
            {s === "removed" && "Archivés"}
            {s === "all" && "Tous"}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Dimension</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Machine / Position</TableHead>
                  <TableHead>Dernière MAJ</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id.slice(0, 8)}</TableCell>
                    <TableCell>{t.brand || "—"}</TableCell>
                    <TableCell>{t.size || "—"}</TableCell>
                    <TableCell>
                        <Badge variant={statusMap[t.status]?.variant}>{statusMap[t.status]?.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {t.machineName || t.machineId ? `${t.machineName ?? t.machineId} • ${t.position ?? "-"}` : "—"}
                    </TableCell>
                    <TableCell>{fmtDate(t.updatedAt || t.createdAt || Date.now())}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/driver/check?tyreId=${t.id}&prefill=montage`}>Monter</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deposer(t)} disabled={t.status !== "mounted"}>
                          Déposer
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => archiver(t)}>
                          Archiver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Aucun pneu dans cette vue.
                    </TableCell>
                  </TableRow>
                )}
                 {loading && rows.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => fetchPage(false)} disabled={!hasMore || loading} variant="outline">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Chargement..." : hasMore ? "Charger plus" : "Fin de la liste"}
        </Button>
      </div>
    </div>
  );
}
