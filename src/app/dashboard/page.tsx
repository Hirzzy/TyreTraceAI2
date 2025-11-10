// src/app/dashboard/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, Plus, Wrench, List as ListIcon, Search, ClipboardEdit, Truck, BarChart2, BadgeEuro } from "lucide-react";

// --- Demo data (can be replaced by Firestore later) ---
const seedMachines = [
  { id: "CAT775G-01", name: "CAT775G-01", type: "Chargeuse", positions: ["1L","1R","2L","2R"] },
  { id: "HD605-02", name: "HD605-02", type: "Chargeuse", positions: ["1L","1R","2L","2R"] },
];

const seedStock = [
  { id: "MIC-240035-011", ref: "MIC-240035-011", dimension: "24.00R35", ageDays: 14, status: "stock" },
  { id: "MIC-240035-007", ref: "MIC-240035-007", dimension: "24.00R35", ageDays: 3, status: "stock" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mb-3">{children}</h2>;
}

export default function TyreTraceMVP() {
  // Navigation
  const [tab, setTab] = useState("dashboard");

  // Data states (front-only for MVP demo)
  const [machines, setMachines] = useState(seedMachines);
  const [stock, setStock] = useState(seedStock);
  const [events, setEvents] = useState<any[]>([]);

  // UI states
  const [showAddTyre, setShowAddTyre] = useState(false);
  const [addedTyreId, setAddedTyreId] = useState<string | null>(null);
  const [showMountStepper, setShowMountStepper] = useState(false);
  const [step, setStep] = useState(1);
  const [mountTyreId, setMountTyreId] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [filterStock, setFilterStock] = useState("all");

  // Encodage express form state
  const [eeMachine, setEeMachine] = useState<string>("");
  const [eeType, setEeType] = useState<"montage"|"rotation"|"depose"|"reparation"|"">("");
  const [eePosition, setEePosition] = useState<string>("");
  const [eeTyreId, setEeTyreId] = useState<string>("");
  const [eeWhen, setEeWhen] = useState<string>(() => new Date().toISOString().slice(0,16)); // YYYY-MM-DDTHH:MM
  const [eeNotes, setEeNotes] = useState<string>("");

  // Ajouter véhicule form state
  const [nvName, setNvName] = useState("");
  const [nvType, setNvType] = useState("Chargeuse");

  const stockCount = useMemo(() => stock.filter(t => t.status === "stock").length, [stock]);
  const lastMounts = useMemo(() => (
    events.filter(e => e.type === "montage").slice(0,3).map((e:any) => ({
      date: new Date(e.at).toLocaleDateString(undefined,{ day:"2-digit", month:"2-digit" }),
      machine: e.machineId,
      pos: e.position
    }))
  ), [events]);

  function openMountFlow(tyreId?: string) {
    if (tyreId) setMountTyreId(tyreId);
    setSelectedMachine(null);
    setSelectedPosition(null);
    setStep(1);
    setShowMountStepper(true);
  }

  function confirmMount() {
    // Update in-memory data
    if (mountTyreId) setStock(prev => prev.filter(t => t.id !== mountTyreId));
    const evt = {
      id: `ev_${Date.now()}`,
      machineId: selectedMachine,
      type: "montage",
      position: selectedPosition,
      tyreId: mountTyreId,
      at: new Date().toISOString(),
    };
    setEvents(prev => [evt, ...prev]);
    setShowMountStepper(false);
    toast.success(`✅ Montage enregistrée sur ${selectedMachine} (Pos ${selectedPosition})`);
  }

  function handleEncodageExpressSubmit() {
    if (!eeMachine) return toast.error("Sélectionnez une machine.");
    if (!eeType) return toast.error("Sélectionnez un type d’intervention.");
    if (!eePosition) return toast.error("Sélectionnez une position.");
    if (eeType === "montage" && !eeTyreId) return toast.error("Sélectionnez un pneu à monter.");

    // Build event (front only)
    const evt = {
      id: `ev_${Date.now()}`,
      machineId: eeMachine,
      type: eeType,
      position: eePosition,
      tyreId: eeType === "montage" ? eeTyreId : undefined,
      at: new Date(eeWhen).toISOString(),
      notes: eeNotes || undefined,
    };
    setEvents(prev => [evt, ...prev]);

    // If montage: remove tyre from stock
    if (eeType === "montage") setStock(prev => prev.filter(t => t.id !== eeTyreId));

    toast.success(`✅ ${eeType.charAt(0).toUpperCase()+eeType.slice(1)} enregistrée sur ${eeMachine} (Pos ${eePosition})`);

    // Reset minimal fields (keep machine for rapid series)
    setEeType("");
    setEePosition("");
    setEeTyreId("");
    setEeNotes("");
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Header with primary CTAs */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="flex gap-2">
          <Button onClick={() => setTab("encodage")} className="gap-2"><ClipboardEdit className="h-4 w-4"/>Encodage express</Button>
          <Button variant="secondary" onClick={() => setTab("ajouterVehicule")} className="gap-2"><Plus className="h-4 w-4"/>Ajouter véhicule</Button>
        </div>
      </div>

      {/* Dashboard sections */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardEdit className="h-5 w-5"/> Prochaines actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setTab("encodage")} className="w-full">Encodage express</Button>
            <Button variant="outline" onClick={() => setTab("ajouterVehicule")} className="w-full">Ajouter véhicule</Button>
            <p className="text-sm text-muted-foreground">Commence ici. 3 étapes, 30 secondes.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock disponible</span>
              <Badge>{stockCount} pneus en stock</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="gap-2" onClick={() => setTab("stock")}>
              <ListIcon className="h-4 w-4"/> Voir le stock
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Derniers montages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lastMounts.length === 0 && (
              <div className="text-sm text-muted-foreground">Aucun montage pour l’instant.</div>
            )}
            {lastMounts.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{m.date}</span>
                <span>{m.machine}</span>
                <span className="text-muted-foreground">Pos {m.pos}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <Button variant="outline" size="sm">Voir tous les montages</Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for pages in the validated order */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="encodage">Encodage express</TabsTrigger>
          <TabsTrigger value="ajouterVehicule">Ajouter véhicule</TabsTrigger>
          <TabsTrigger value="machines">Gestion de flotte</TabsTrigger>
          <TabsTrigger value="analyse">Analyse des pneus</TabsTrigger>
          <TabsTrigger value="tarifs">Fonctionnalités & Tarifs</TabsTrigger>
        </TabsList>

        {/* DASHBOARD placeholder (we already show header content above) */}
        <TabsContent value="dashboard"></TabsContent>

        {/* ENCODOGE EXPRESS */}
        <TabsContent value="encodage" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Encodage express</h2>
            <p className="text-sm text-muted-foreground">Encoder une intervention directement devant la machine (30 s).</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Intervention</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Machine */}
                <div className="grid gap-2">
                  <Label>Machine</Label>
                  <select value={eeMachine} onChange={e=>setEeMachine(e.target.value)} className="border rounded-md p-2">
                    <option value="">Choisir une machine…</option>
                    {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {/* Type */}
                <div className="grid gap-2">
                  <Label>Type d’intervention</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["montage","rotation","depose","reparation"] as const).map(t => (
                      <Button key={t} variant={eeType===t?"default":"outline"} onClick={()=>setEeType(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</Button>
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div className="grid gap-2">
                  <Label>Position</Label>
                  <div className="flex flex-wrap gap-2">
                    {(machines.find(m=>m.id===eeMachine)?.positions || ["1L","1R","2L","2R"]).map(p => (
                      <Button key={p} variant={eePosition===p?"default":"outline"} onClick={()=>setEePosition(p)}>{p}</Button>
                    ))}
                  </div>
                </div>

                {/* Pneu */}
                {eeType === "montage" && (
                  <div className="grid gap-2">
                    <Label>Pneu concerné</Label>
                    <select value={eeTyreId} onChange={e=>setEeTyreId(e.target.value)} className="border rounded-md p-2">
                      <option value="">Sélectionner un pneu…</option>
                      {stock.map(t => <option key={t.id} value={t.id}>{t.ref} • {t.dimension}</option>)}
                    </select>
                    <p className="text-xs text-muted-foreground">Vous pouvez choisir un pneu depuis le stock.</p>
                  </div>
                )}

                {/* Date/Notes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Date/heure</Label>
                    <Input type="datetime-local" value={eeWhen} onChange={e=>setEeWhen(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Notes (optionnel)</Label>
                    <Textarea placeholder="Ex. Crevaison lente, jante OK…" value={eeNotes} onChange={e=>setEeNotes(e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>{ setEeType(""); setEePosition(""); setEeTyreId(""); }}>Annuler</Button>
                  <Button onClick={handleEncodageExpressSubmit}>Enregistrer l’intervention</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Derniers montages</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {lastMounts.length === 0 && <div className="text-sm text-muted-foreground">Aucun montage pour l’instant.</div>}
                {lastMounts.map((m,i)=>(
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{m.date}</span>
                    <span>{m.machine}</span>
                    <span className="text-muted-foreground">Pos {m.pos}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AJOUTER VÉHICULE */}
        <TabsContent value="ajouterVehicule" className="space-y-4">
          <h2 className="text-lg font-semibold">Ajouter véhicule</h2>
          <Card>
            <CardContent className="grid md:grid-cols-3 gap-4 p-6">
              <div className="grid gap-2">
                <Label>Nom de la machine</Label>
                <Input placeholder="Ex. CAT775G-03" value={nvName} onChange={e=>setNvName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <select value={nvType} onChange={e=>setNvType(e.target.value)} className="border rounded-md p-2">
                  <option>Chargeuse</option>
                  <option>Dump RDT</option>
                  <option>Dump ADT</option>
                  <option>Chariot</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Positions</Label>
                <Input defaultValue="1L,1R,2L,2R" />
                <p className="text-xs text-muted-foreground">Format : 1L,1R,2L,2R…</p>
              </div>
              <div className="md:col-span-3 flex justify-end gap-2">
                <Button variant="outline" onClick={()=>{ setNvName(""); }}>Annuler</Button>
                <Button onClick={()=>{
                  if(!nvName) return toast.error("Saisir un nom de machine.");
                  const positions = (document.querySelector<HTMLInputElement>('input[defaultValue="1L,1R,2L,2R"]')?.value || "1L,1R,2L,2R").split(',').map(s=>s.trim());
                  const newM = { id: nvName, name: nvName, type: nvType, positions };
                  setMachines(prev=>[newM, ...prev]);
                  toast.success(`✅ Machine ${nvName} créée`);
                  setNvName("");
                }}>Créer la machine</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STOCK */}
        <TabsContent value="stock" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Stock pneus</h2>
            <div className="flex gap-2">
              <Button variant={filterStock === "all" ? "default" : "outline"} onClick={() => setFilterStock("all")}>Tous</Button>
              <Button variant={filterStock === "stock" ? "default" : "outline"} onClick={() => setFilterStock("stock")}>En stock</Button>
              <Button variant="outline" disabled>Montés</Button>
            </div>
          </div>

          {stock.filter(s => filterStock === "all" || s.status === filterStock).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="font-medium mb-2">Aucun pneu en stock</p>
                <p className="text-sm text-muted-foreground mb-4">Ajoutez un pneu au stock pour pouvoir le monter.</p>
                <Button onClick={() => setShowAddTyre(true)} className="gap-2"><Plus className="h-4 w-4"/>Ajouter un pneu au stock</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {stock.filter(s => filterStock === "all" || s.status === filterStock).map((t) => (
                <Card key={t.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{t.dimension}</Badge>
                    <div>
                      <div className="font-medium">{t.ref}</div>
                      <div className="text-sm text-muted-foreground">Âge : {t.ageDays} j • Statut : En stock</div>
                    </div>
                  </div>
                  <Button className="gap-2" onClick={() => openMountFlow(t.id)}><Wrench className="h-4 w-4"/>Monter</Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MACHINES (Gestion de flotte) */}
        <TabsContent value="machines" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Gestion de flotte</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
              <Input placeholder="Rechercher une machine…" className="pl-8"/>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {machines.map(m => (
              <Card key={m.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-muted-foreground">{m.type} • {m.positions.length} positions</div>
                  </div>
                  <Button className="gap-2" onClick={() => { setTab("encodage"); setEeMachine(m.id); }}><Wrench className="h-4 w-4"/>Monter un pneu</Button>
                </div>
                <Separator className="my-3" />
                <SectionTitle>Positions</SectionTitle>
                <div className="grid grid-cols-4 gap-2">
                  {m.positions.map(p => (
                    <div key={p} className="rounded-xl border p-3 text-center text-sm">{p}<div className="text-xs text-muted-foreground">Vide</div></div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ANALYSE DES PNEUS (placeholder MVP) */}
        <TabsContent value="analyse" className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><BarChart2 className="h-5 w-5"/> Analyse des pneus</h2>
          <Card><CardContent className="p-6 text-sm text-muted-foreground">À venir : récap mensuel (nombre de montages, répartition par dimension, mini recommandations).</CardContent></Card>
        </TabsContent>

        {/* TARIFS (placeholder MVP) */}
        <TabsContent value="tarifs" className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><BadgeEuro className="h-5 w-5"/> Fonctionnalités & Tarifs</h2>
          <Card>
            <CardContent className="p-6 space-y-2 text-sm">
              <div><strong>Starter</strong> — 49 €/mois (1 site)</div>
              <div><strong>Pro</strong> — 99 €/mois/site (multi-site, API, marque blanche)</div>
              <div><strong>Business</strong> — 199 €/mois/site (SSO, benchmarks)</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: Add Tyre to stock */}
      <Dialog open={showAddTyre} onOpenChange={setShowAddTyre}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un pneu au stock</DialogTitle>
            <DialogDescription>Renseignez les informations minimales.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label>Dimension</Label>
              <Input placeholder="Ex. 24.00R35" defaultValue="24.00R35"/>
            </div>
            <div className="grid gap-2">
              <Label>Référence interne</Label>
              <Input placeholder="Ex. MIC-240035-012" />
            </div>
            <div className="grid gap-2">
              <Label>Marque (optionnel)</Label>
              <Input placeholder="Ex. Michelin"/>
            </div>
          </div>
          <DialogFooter className="justify-between">
            <Button variant="outline" onClick={() => setShowAddTyre(false)}>Annuler</Button>
            <Button onClick={() => {
              const id = `MIC-240035-${String(Math.floor(Math.random()*90)+10)}`;
              setStock(prev => [{ id, ref: id, dimension: "24.00R35", ageDays: 0, status: "stock" }, ...prev]);
              setShowAddTyre(false);
              setAddedTyreId(id);
            }}>Ajouter au stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Success after adding with CTA to mount */}
      <Dialog open={!!addedTyreId} onOpenChange={(v) => { if (!v) setAddedTyreId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Check className="h-5 w-5"/> Pneu ajouté au stock</DialogTitle>
            <DialogDescription>Réf : {addedTyreId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Vous pouvez monter ce pneu immédiatement sur une machine.</p>
          </div>
          <DialogFooter className="justify-between">
            <Button variant="outline" onClick={() => setAddedTyreId(null)}>Ajouter un autre pneu</Button>
            <Button onClick={() => { const id = addedTyreId; setAddedTyreId(null); openMountFlow(id!); }}>Monter ce pneu maintenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Mount Stepper */}
      <Dialog open={showMountStepper} onOpenChange={setShowMountStepper}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Monter un pneu</DialogTitle>
            <DialogDescription>Étape {step} sur 3</DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <SectionTitle>1. Choisir une machine</SectionTitle>
              <RadioGroup value={selectedMachine ?? undefined} onValueChange={setSelectedMachine} className="grid gap-2">
                {machines.map(m => (
                  <Label key={m.id} className={`border rounded-xl p-3 cursor-pointer ${selectedMachine===m.id?"border-primary":""}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={m.id} id={`m-${m.id}`}/>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.type} • {m.positions.length} positions</div>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMountStepper(false)}>Annuler</Button>
                <Button disabled={!selectedMachine} onClick={() => setStep(2)}>Continuer</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <SectionTitle>2. Choisir la position</SectionTitle>
              <div className="grid grid-cols-4 gap-2">
                {machines.find(m => m.id === selectedMachine)?.positions.map(p => (
                  <button key={p} onClick={() => setSelectedPosition(p)} className={`rounded-xl border p-3 text-center text-sm ${selectedPosition===p?"border-primary ring-1 ring-primary":""}`}>{p}<div className="text-xs text-muted-foreground">Vide</div></button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
                <Button disabled={!selectedPosition} onClick={() => setStep(3)}>Continuer</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <SectionTitle>3. Confirmation</SectionTitle>
              <Card className="p-4">
                <div className="text-sm">Machine</div>
                <div className="font-medium">{selectedMachine}</div>
                <Separator className="my-2"/>
                <div className="text-sm">Position</div>
                <div className="font-medium">{selectedPosition}</div>
                <Separator className="my-2"/>
                <div className="text-sm">Pneu</div>
                <div className="font-medium">{mountTyreId ?? "Sélectionner depuis le stock"}</div>
              </Card>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Retour</Button>
                <Button onClick={confirmMount}>Terminer le montage</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
