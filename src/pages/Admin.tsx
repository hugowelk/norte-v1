import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportMarkdown } from "@/components/report/ReportMarkdown";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { toast } from "sonner";

interface Entry {
  id: string;
  created_at: string;
  view_count: number;
  input_data: any;
  report_markdown: string;
  contact: { name: string; email: string; report_url: string; created_at: string } | null;
  reviews: { rating: number; feedback: string | null; created_at: string }[];
}

const PW_KEY = "norte_admin_pw";

const AdminPage = () => {
  useDocumentMeta(
    [{ name: 'robots', content: 'noindex, nofollow' }],
    { title: 'Norte — Admin', canonical: 'https://findmyvalues.app/admin' }
  );
  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_KEY) ?? "");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchData = async (pw: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list", {
        headers: { "x-admin-password": pw },
      });
      if (error || (data as any)?.error) {
        toast.error("Invalid password or server error");
        sessionStorage.removeItem(PW_KEY);
        setAuthed(false);
        return;
      }
      const list = (data as { entries: Entry[] }).entries;
      setEntries(list);
      setAuthed(true);
      sessionStorage.setItem(PW_KEY, pw);
      if (list.length > 0) setSelectedId(list[0].id);
    } catch (e) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(PW_KEY);
    if (stored) fetchData(stored);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl text-primary">Admin access</h1>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData(password)}
          />
          <Button onClick={() => fetchData(password)} disabled={loading || !password} className="w-full">
            {loading ? "Checking…" : "Enter"}
          </Button>
        </Card>
      </div>
    );
  }

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* List */}
      <aside className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-lg text-primary">Reports</h2>
          <p className="text-xs text-muted-foreground">{entries.length} total</p>
          <a href="/admin/translations" className="text-xs text-accent underline mt-2 inline-block">Edit pt-BR translations →</a>
        </div>
        <ScrollArea className="flex-1">
          <ul>
            {entries.map((entry) => {
              const isActive = entry.id === selectedId;
              const date = new Date(entry.created_at).toLocaleString();
              return (
                <li key={entry.id}>
                  <button
                    onClick={() => setSelectedId(entry.id)}
                    className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      isActive ? "bg-muted" : ""
                    }`}
                  >
                    <div className="font-medium text-sm text-foreground truncate">
                      {entry.contact?.name ?? "(no name)"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {entry.contact?.email ?? entry.id}
                    </div>
                    <div className="text-[11px] text-muted-foreground/70 mt-1">{date}</div>
                    {entry.reviews.length > 0 && (
                      <div className="text-[11px] text-accent mt-1">
                        ★ {entry.reviews[0].rating}/5
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </aside>

      {/* Detail */}
      <main className="flex-1 overflow-auto">
        {!selected ? (
          <div className="p-8 text-muted-foreground">Select an entry</div>
        ) : (
          <div className="max-w-4xl mx-auto p-8 space-y-8">
            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Contact</h3>
              <div className="text-sm space-y-1">
                <div><strong>Name:</strong> {selected.contact?.name ?? "—"}</div>
                <div><strong>Email:</strong> {selected.contact?.email ?? "—"}</div>
                <div><strong>Report ID:</strong> {selected.id}</div>
                <div><strong>Created:</strong> {new Date(selected.created_at).toLocaleString()}</div>
                <div><strong>Views:</strong> {selected.view_count}</div>
                {selected.contact?.report_url && (
                  <div>
                    <strong>URL:</strong>{" "}
                    <a href={selected.contact.report_url} target="_blank" rel="noreferrer" className="text-accent underline">
                      {selected.contact.report_url}
                    </a>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Revealed values</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(selected.input_data?.revealed ?? selected.input_data?.revealed_values ?? null, null, 2)}
              </pre>
            </section>

            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Chosen values</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(selected.input_data?.aspirational_top_3 ?? selected.input_data?.chosen ?? null, null, 2)}
              </pre>
            </section>

            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Post-paywall answers</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(selected.input_data?.postPaywallAnswers ?? selected.input_data?.post_paywall ?? null, null, 2)}
              </pre>
            </section>

            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Review</h3>
              {selected.reviews.length === 0 ? (
                <div className="text-sm text-muted-foreground">No review submitted.</div>
              ) : (
                selected.reviews.map((r, i) => (
                  <div key={i} className="text-sm mb-2">
                    <div>★ {r.rating}/5 — {new Date(r.created_at).toLocaleString()}</div>
                    {r.feedback && <div className="text-muted-foreground mt-1">{r.feedback}</div>}
                  </div>
                ))
              )}
            </section>

            <section>
              <h3 className="font-display text-xs uppercase tracking-wide text-muted-foreground mb-2">Full report</h3>
              <Card className="p-6">
                <ReportMarkdown markdown={selected.report_markdown} />
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
