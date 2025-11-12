export function toCsv<T extends object>(rows: T[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map(r => headers.map(h => esc((r as any)[h])).join(",")).join("\n");
  return headers.join(",") + "\n" + body;
}

export function download(filename: string, text: string, type = "text/csv") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const fmtDate = (ts: any) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("fr-FR");
};
export const fmtHeure = (ts: any) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};
