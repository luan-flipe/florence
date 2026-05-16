/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase-server";
import type { LeadStatus } from "@/types/database";

export async function fetchAnalytics(opts: { since: Date; until: Date; course?: string }) {
  const supabase = createClient();

  // 1. Leads no período
  let leadsQuery = supabase
    .from("leads")
    .select("id, course, created_at, utm_source")
    .gte("created_at", opts.since.toISOString())
    .lte("created_at", opts.until.toISOString());

  if (opts.course) leadsQuery = leadsQuery.eq("course", opts.course);

  const { data: leadsData, error } = await leadsQuery;
  if (error) throw error;
  const leads = leadsData ?? [];
  const leadIds = leads.map((l) => l.id);

  // 2. Status atual dos leads
  let statusMap = new Map<string, LeadStatus>();
  if (leadIds.length > 0) {
    const { data: statusData } = await supabase
      .from("lead_status")
      .select("lead_id, status")
      .in("lead_id", leadIds);
    statusMap = new Map((statusData ?? []).map((s: any) => [s.lead_id, s.status as LeadStatus]));
  }

  // 3. Histórico — para calcular tempo até primeiro contato
  const historyByLead = new Map<string, { to_status: string; changed_at: string }[]>();
  if (leadIds.length > 0) {
    const { data: historyData } = await supabase
      .from("lead_status_history")
      .select("lead_id, to_status, changed_at")
      .in("lead_id", leadIds);
    (historyData ?? []).forEach((h: any) => {
      const arr = historyByLead.get(h.lead_id) ?? [];
      arr.push({ to_status: h.to_status, changed_at: h.changed_at });
      historyByLead.set(h.lead_id, arr);
    });
  }

  // 4. Período anterior para delta
  const periodMs = opts.until.getTime() - opts.since.getTime();
  const prevStart = new Date(opts.since.getTime() - periodMs);
  const prevEnd = opts.since;
  const { count: prevCount } = await supabase
    .from("leads").select("*", { count: "exact", head: true })
    .gte("created_at", prevStart.toISOString())
    .lt("created_at", prevEnd.toISOString());

  // ─── Métricas ─────────────────────────────────────────────────
  const total = leads.length;
  const totalDelta = prevCount ? Math.round(((total - prevCount) / prevCount) * 100) : 0;

  // Funil
  const funnel: Record<LeadStatus, number> = {
    novo: 0, contactado: 0, em_conversa: 0,
    matricula_iniciada: 0, matriculado: 0, perdido: 0,
  };
  leads.forEach((l) => {
    const s = statusMap.get(l.id);
    if (s) funnel[s]++;
  });

  // Conversão
  const conversion = total > 0 ? (funnel.matriculado / total) * 100 : 0;

  // Tempo médio até primeiro contato (horas)
  const contactTimes: number[] = [];
  leads.forEach((l) => {
    const history = historyByLead.get(l.id) ?? [];
    const firstContact = history
      .filter((h) => h.to_status === "contactado")
      .sort((a, b) => a.changed_at.localeCompare(b.changed_at))[0];
    if (firstContact) {
      const ms = new Date(firstContact.changed_at).getTime() - new Date(l.created_at).getTime();
      contactTimes.push(ms / 1000 / 3600);
    }
  });
  const avgContactHours = contactTimes.length > 0
    ? contactTimes.reduce((a, b) => a + b, 0) / contactTimes.length
    : 0;

  // Leads por dia
  const byDay = new Map<string, number>();
  leads.forEach((l) => {
    const day = l.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  });
  const timeline = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));

  // Por curso
  const byCourse = new Map<string, number>();
  leads.forEach((l) => byCourse.set(l.course, (byCourse.get(l.course) ?? 0) + 1));

  // Por fonte UTM
  const bySource = new Map<string, number>();
  leads.forEach((l) => {
    const src = l.utm_source ?? "direto";
    bySource.set(src, (bySource.get(src) ?? 0) + 1);
  });

  // Heatmap dia/hora (7×24)
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  leads.forEach((l) => {
    const d = new Date(l.created_at);
    heatmap[d.getDay()][d.getHours()]++;
  });

  return {
    total,
    totalDelta,
    conversion: Math.round(conversion * 10) / 10,
    avgContactHours: Math.round(avgContactHours * 10) / 10,
    matriculados: funnel.matriculado,
    funnel,
    timeline,
    byCourse: Array.from(byCourse.entries()).map(([course, count]) => ({ course, count })),
    bySource: Array.from(bySource.entries()).map(([source, count]) => ({ source, count })),
    heatmap,
  };
}
