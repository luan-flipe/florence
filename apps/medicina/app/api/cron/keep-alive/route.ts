import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Endpoint chamado pelo Vercel Cron Jobs diariamente para evitar
// que o projeto do Supabase Free pause por inatividade (>7 dias).
//
// Faz uma query trivial (count na tabela de leads) para registrar
// atividade no banco. O Vercel envia o header `Authorization: Bearer <CRON_SECRET>`
// automaticamente — validamos para impedir chamadas externas.

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { count, error } = await supabaseAdmin()
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      leadsCount: count ?? 0,
    });
  } catch (err) {
    console.error("Keep-alive error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
