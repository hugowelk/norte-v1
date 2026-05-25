import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { toast } from "sonner";
import enCommon from "@/i18n/locales/en/common.json";
import ptCommon from "@/i18n/locales/pt-BR/common.json";
import { AdminNav } from "@/components/admin/AdminNav";

const PW_KEY = "norte_admin_pw";
const DRAFT_KEY = "norte_admin_pt_draft_v1";

type Flat = Record<string, string>;

function flatten(obj: unknown, prefix = "", out: Flat = {}): Flat {
  if (obj === null || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, path, out);
    } else {
      out[path] = Array.isArray(v) ? JSON.stringify(v) : String(v ?? "");
    }
  }
  return out;
}

function unflatten(flat: Flat): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let node: Record<string, unknown> = root;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) {
        // Try to preserve arrays if value parses as JSON array
        if (value.startsWith("[") && value.endsWith("]")) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              node[p] = parsed;
              return;
            }
          } catch { /* fall through */ }
        }
        node[p] = value;
      } else {
        if (typeof node[p] !== "object" || node[p] === null) node[p] = {};
        node = node[p] as Record<string, unknown>;
      }
    });
  }
  return root;
}

type Group = { id: string; label: string; url: string };

const GROUPS: Group[] = [
  { id: "pages.index", label: "Home", url: "/" },
  { id: "pages.methodology", label: "Methodology", url: "/methodology" },
  { id: "pages.notFound", label: "404", url: "/*" },
  { id: "quiz", label: "Quiz flow", url: "/ (quiz)" },
  { id: "postPaywall", label: "Post-paywall", url: "/report/:id" },
  { id: "report", label: "Report", url: "/report/:id" },
  { id: "values", label: "Values (shared)", url: "—" },
  { id: "common", label: "Common (shared)", url: "—" },
  { id: "ordinals", label: "Ordinals (shared)", url: "—" },
];

function groupOf(key: string): Group {
  for (const g of GROUPS) {
    if (key === g.id || key.startsWith(g.id + ".")) return g;
  }
  return { id: "_other", label: "Other", url: "—" };
}

const AdminTranslationsPage = () => {

  useDocumentMeta(
    [{ name: "robots", content: "noindex, nofollow" }],
    { title: "Norte — Translations", canonical: "https://findmyvalues.app/admin/translations" }
  );

  const authed = !!sessionStorage.getItem(PW_KEY);

  const enFlat = useMemo(() => flatten(enCommon), []);
  const ptFlatOriginal = useMemo(() => flatten(ptCommon), []);

  const [pt, setPt] = useState<Flat>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return { ...ptFlatOriginal, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return ptFlatOriginal;
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "missing" | "modified">("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  useEffect(() => {
    // Save only diffs vs original
    const diff: Flat = {};
    for (const k of Object.keys(enFlat)) {
      if ((pt[k] ?? "") !== (ptFlatOriginal[k] ?? "")) diff[k] = pt[k] ?? "";
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(diff));
  }, [pt, enFlat, ptFlatOriginal]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-sm text-center space-y-4">
          <p>Sign in via the admin page first.</p>
          <Link to="/admin" className="text-accent underline">Go to /admin</Link>
        </Card>
      </div>
    );
  }

  const keys = Object.keys(enFlat);
  const visibleKeys = keys.filter((k) => {
    const en = enFlat[k] ?? "";
    const ptv = pt[k] ?? "";
    if (filter === "missing" && ptv.trim() !== "") return false;
    if (filter === "modified" && ptv === (ptFlatOriginal[k] ?? "")) return false;
    if (groupFilter !== "all" && groupOf(k).id !== groupFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return k.toLowerCase().includes(q) || en.toLowerCase().includes(q) || ptv.toLowerCase().includes(q);
  });

  // Group counts (respect filter + query, ignore groupFilter so user can switch groups)
  const groupCounts = new Map<string, number>();
  for (const k of keys) {
    const en = enFlat[k] ?? "";
    const ptv = pt[k] ?? "";
    if (filter === "missing" && ptv.trim() !== "") continue;
    if (filter === "modified" && ptv === (ptFlatOriginal[k] ?? "")) continue;
    if (query) {
      const q = query.toLowerCase();
      if (!k.toLowerCase().includes(q) && !en.toLowerCase().includes(q) && !ptv.toLowerCase().includes(q)) continue;
    }
    const id = groupOf(k).id;
    groupCounts.set(id, (groupCounts.get(id) ?? 0) + 1);
  }

  // Group visibleKeys by group id, preserving order
  const groupedMap = new Map<string, { group: Group; keys: string[] }>();
  for (const k of visibleKeys) {
    const g = groupOf(k);
    if (!groupedMap.has(g.id)) groupedMap.set(g.id, { group: g, keys: [] });
    groupedMap.get(g.id)!.keys.push(k);
  }
  const grouped = Array.from(groupedMap.values());



  const missingCount = keys.filter((k) => (pt[k] ?? "").trim() === "").length;
  const modifiedCount = keys.filter((k) => (pt[k] ?? "") !== (ptFlatOriginal[k] ?? "")).length;

  const handleDownload = () => {
    const json = JSON.stringify(unflatten(pt), null, 2) + "\n";
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "common.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded common.json — replace src/i18n/locales/pt-BR/common.json");
  };

  const handleCopy = async () => {
    const json = JSON.stringify(unflatten(pt), null, 2);
    await navigator.clipboard.writeText(json);
    toast.success("Copied JSON to clipboard");
  };

  const handleReset = () => {
    if (!confirm("Discard all local edits and revert to the file on disk?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setPt(ptFlatOriginal);
    toast.success("Reverted to disk");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="border-b border-border bg-background sticky top-14 z-10">
        <div className="max-w-6xl mx-auto p-4 flex flex-wrap gap-3 items-center">
          <h1 className="font-display text-xl text-primary">pt-BR translations</h1>
          <span className="text-xs text-muted-foreground">
            {keys.length} keys · {missingCount} missing · {modifiedCount} modified
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>Copy JSON</Button>
            <Button size="sm" onClick={handleDownload}>Download common.json</Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-4 flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search key or text…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          {(["all", "missing", "modified"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            Showing {visibleKeys.length}. Edits autosave locally; download to ship.
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 space-y-3">
        {visibleKeys.map((k) => {
          const en = enFlat[k] ?? "";
          const ptv = pt[k] ?? "";
          const modified = ptv !== (ptFlatOriginal[k] ?? "");
          const missing = ptv.trim() === "";
          const isMultiline = en.length > 80 || en.includes("\n");
          return (
            <Card key={k} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-xs text-muted-foreground break-all">{k}</code>
                {missing && <span className="text-[10px] uppercase tracking-wide text-destructive">missing</span>}
                {modified && !missing && <span className="text-[10px] uppercase tracking-wide text-accent">modified</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted/40 rounded p-3">
                  {en || <em className="opacity-60">(empty)</em>}
                </div>
                {isMultiline ? (
                  <textarea
                    value={ptv}
                    onChange={(e) => setPt((p) => ({ ...p, [k]: e.target.value }))}
                    rows={Math.max(3, Math.min(12, ptv.split("\n").length + 1))}
                    className="text-sm rounded border border-input bg-background p-3 font-sans"
                  />
                ) : (
                  <Input
                    value={ptv}
                    onChange={(e) => setPt((p) => ({ ...p, [k]: e.target.value }))}
                  />
                )}
              </div>
            </Card>
          );
        })}
        {visibleKeys.length === 0 && (
          <div className="text-center text-muted-foreground py-12">No keys match.</div>
        )}
      </main>
    </div>
  );
};

export default AdminTranslationsPage;
