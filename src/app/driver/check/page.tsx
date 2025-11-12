
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp,
  updateDoc, where, limit, DocumentSnapshot
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Send } from "lucide-react";

type Machine = { id: string; name: string };
type Tyre = {
  id: string; brand?: string; size?: string;
  status: "stock"|"mounted"|"removed";
  tenantId: string;
  machineId?: string|null; position?: string|null;
  updatedAt?: any;
};

const POSITIONS = ["1L","1R","2L","2R","3L","3R","4L","4R"] as const;
type TypeInterv = "Montage"|"Rotation"|"Dépose"|"Réparation";

export default function EncodageExpressPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const prefillTyreId = sp.get("tyreId");
  const prefillIsMontage = sp.get("prefill")==="montage";

  const [machines, setMachines] = useState<Machine[]>([]);
  const [tyresStock, setTyresStock] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [machineId, setMachineId] = useState("");
  const [type, setType] = useState<TypeInterv>(prefillIsMontage ? "Montage" : "Montage");
  const [position, setPosition] = useState<(typeof POSITIONS)[number] | "">("");
  const [tyreId, setTyreId] = useState<string>(prefillTyreId ?? "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uid = user?.uid;

  // --- load machines + tyres (stock) for this tenant
  useEffect(() => {
    if (!uid || !db) return;

    setLoading(true);
    (async () => {
      try {
        // Machines
        const qm = query(
          collection(db, "machines"),
          where("tenantId", "==", uid),
          orderBy("name"), limit(500)
        );
        const mSnap = await getDocs(qm);
        setMachines(mSnap.docs.map(d => ({ id: d.id, name: (d.data() as any).name || d.id })));

        // Tyres in stock
        const qt = query(
          collection(db, "tyres"),
          where("tenantId", "==", uid),
          where("status", "==", "stock"),
          orderBy("updatedAt", "desc"), limit(500)
        );
        const tSnap = await getDocs(qt);
        const list = tSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Tyre[];

        // If a pre-filled tyreId is not in stock, load it to display it anyway
        if (prefillTyreId && !list.find(t => t.id === prefillTyreId)) {
          const td = await getDoc(doc(db, "tyres", prefillTyreId));
          if (td.exists() && (td.data() as Tyre).tenantId === uid) {
            list.unshift({ id: td.id, ...(td.data() as any) } as Tyre);
          }
        }
        setTyresStock(list);
      } catch (err: any) {
        console.error("Error fetching initial data: ", err);
        setError("Impossible de charger les données. Vérifiez les indexes Firestore et votre connexion.");
      } finally {
        setLoading(false);
      }
    })();
  }, [uid, db, prefillTyreId]);
  
  const machineName = useMemo(
    () => machines.find(m => m.id === machineId)?.name ?? "",
    [machines, machineId]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!uid || !db) { setError("Session expirée ou connexion DB impossible. Merci de vous reconnecter."); return; }
    if (!machineId) { setError("Sélectionnez une machine."); return; }
    if (!type) { setError("Sélectionnez un type d’intervention."); return; }
    if (type === "Montage" && !tyreId) { setError("Sélectionnez un pneu à monter."); return; }
    if (type !== "Réparation" && !position) { setError("Sélectionnez une position."); return; }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "events"), {
        tenantId: uid,
        machineId,
        machineName,
        type: type.toLowerCase(),
        position: position || null,
        tyreId: tyreId || null,
        notes: notes || null,
        at: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (type === "Montage" && tyreId) {
        await updateDoc(doc(db, "tyres", tyreId), {
          status: "mounted",
          machineId,
          machineName,
          position: position || null,
          updatedAt: serverTimestamp()
        });
      }
      if (type === "Dépose" && tyreId) {
        await updateDoc(doc(db, "tyres", tyreId), {
          status: "stock",
          machineId: null,
          machineName: null,
          position: null,
          updatedAt: serverTimestamp()
        });
      }

      toast({
        title: "Intervention enregistrée",
        description: `${type} sur ${machineName || machineId}${position ? ` (${position})` : ""}`,
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erreur inattendue. L'index Firestore est peut-être manquant.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <Card className="w-full bg-card text-card-foreground shadow-xl border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Encodage express</CardTitle>
          <CardDescription>Encoder une intervention directement <b>devant la machine</b> (30s).</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            
            {loading && (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!loading && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="machine-select">Machine</Label>
                  <Select onValueChange={setMachineId} value={machineId} required>
                    <SelectTrigger id="machine-select">
                      <SelectValue placeholder="— choisir —" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type d’intervention</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["Montage","Rotation","Dépose","Réparation"] as const).map(t => (
                      <Button
                        type="button" key={t} onClick={() => setType(t)}
                        variant={type === t ? "default" : "outline"}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                {type !== "Réparation" && (
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {POSITIONS.map(p => (
                        <Button key={p} type="button" onClick={() => setPosition(p)}
                                variant={position === p ? "default" : "outline"}
                                size="sm" className="aspect-square h-auto">
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {(type === "Montage" || type === "Dépose") && (
                  <div className="space-y-2">
                    <Label htmlFor="tyre-select">Pneu concerné {type==="Montage" && "(depuis le stock)"}</Label>
                    <Select onValueChange={setTyreId} value={tyreId} required={type === "Montage"}>
                       <SelectTrigger id="tyre-select">
                        <SelectValue placeholder="— choisir —" />
                      </SelectTrigger>
                      <SelectContent>
                        {tyresStock.map(t => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.brand ?? "Pneu"} • {t.size ?? "—"} • {t.id.slice(0,6)}
                            {t.status !== "stock" ? " (non stock)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     <p className="text-xs text-muted-foreground pt-1">
                        Si vous avez prérempli depuis la liste, le pneu apparaît automatiquement.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex : pression, remarque terrain…"/>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>Annuler</Button>
            <Button type="submit" disabled={submitting || loading}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
