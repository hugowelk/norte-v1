import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  const provided = req.headers.get("x-admin-password");
  if (!adminPassword || provided !== adminPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const [reportsRes, contactsRes, reviewsRes] = await Promise.all([
      supabase.from("reports").select("id, created_at, input_data, report_markdown, view_count").order("created_at", { ascending: false }).limit(500),
      supabase.from("report_contacts").select("report_id, name, email, report_url, created_at"),
      supabase.from("report_reviews").select("report_id, rating, feedback, created_at").order("created_at", { ascending: false }),
    ]);

    if (reportsRes.error) throw reportsRes.error;
    if (contactsRes.error) throw contactsRes.error;
    if (reviewsRes.error) throw reviewsRes.error;

    const contactsByReport = new Map<string, any>();
    (contactsRes.data ?? []).forEach((c) => {
      if (c.report_id) contactsByReport.set(c.report_id, c);
    });

    const reviewsByReport = new Map<string, any[]>();
    (reviewsRes.data ?? []).forEach((r) => {
      if (!r.report_id) return;
      const arr = reviewsByReport.get(r.report_id) ?? [];
      arr.push(r);
      reviewsByReport.set(r.report_id, arr);
    });

    const entries = (reportsRes.data ?? []).map((r) => ({
      id: r.id,
      created_at: r.created_at,
      view_count: r.view_count,
      input_data: r.input_data,
      report_markdown: r.report_markdown,
      contact: contactsByReport.get(r.id) ?? null,
      reviews: reviewsByReport.get(r.id) ?? [],
    }));

    return new Response(JSON.stringify({ entries }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
