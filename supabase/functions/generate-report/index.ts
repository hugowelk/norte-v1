import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { NORTE_REPORT_SYSTEM_PROMPT } from "./prompt.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MODEL = "google/gemini-3-flash-preview";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
function shortId(len = 12) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

async function callLovableAI(inputData: unknown): Promise<string> {
  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: NORTE_REPORT_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Generate the report for this user:\n\n" +
          JSON.stringify(inputData, null, 2),
      },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  };

  const doFetch = () =>
    fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

  let res = await doFetch();
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000));
    res = await doFetch();
  }

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI gateway error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty AI response");
  }
  return content;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = await req.json();
    const { paymentSessionId, assessmentResults, postPaywallAnswers } = body ?? {};

    if (!paymentSessionId || typeof paymentSessionId !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Missing paymentSessionId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Idempotency check
    const existing = await supabase
      .from("reports")
      .select("id")
      .eq("payment_session_id", paymentSessionId)
      .maybeSingle();

    if (existing.data?.id) {
      return new Response(
        JSON.stringify({ success: true, report_id: existing.data.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const inputData = { ...assessmentResults, ...postPaywallAnswers };

    const report_markdown = await callLovableAI(inputData);
    const id = shortId();

    const insert = await supabase.from("reports").insert({
      id,
      payment_session_id: paymentSessionId,
      input_data: inputData,
      report_markdown,
    }).select("id").single();

    if (insert.error) {
      // Race: another concurrent call already inserted — fetch it
      const again = await supabase
        .from("reports")
        .select("id")
        .eq("payment_session_id", paymentSessionId)
        .maybeSingle();
      if (again.data?.id) {
        return new Response(
          JSON.stringify({ success: true, report_id: again.data.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw new Error(`DB insert failed: ${insert.error.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, report_id: insert.data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-report error:", err);
    const msg = err instanceof Error ? err.message : "Generation failed. Please retry.";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
