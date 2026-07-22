import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Método não permitido. Use POST." }, 405);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Count before deletion for logging
    const { count: examCount } = await supabase
      .from("exams")
      .select("*", { count: "exact", head: true });

    // tooth_records are removed via ON DELETE CASCADE
    const { error } = await supabase
      .from("exams")
      .delete()
      .gte("created_at", "1970-01-01");

    if (error) {
      console.error("Delete error:", error);
      return json({ success: false, error: error.message }, 500);
    }

    const deleted = examCount ?? 0;
    console.log(`[delete-all-exams] Removed ${deleted} exam(s).`);

    return json({ success: true, deleted });
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({ success: false, error: "Erro interno do servidor." }, 500);
  }
});
