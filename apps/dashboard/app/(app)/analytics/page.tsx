import { requireRole } from "@/lib/auth";
import { fetchAnalytics } from "@/lib/queries/analytics";
import { fetchLeads } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/analytics/kpi-card";
import { FunnelChart } from "@/components/analytics/funnel-chart";
import { LeadsTimeline } from "@/components/analytics/leads-timeline";
import { SourceBars } from "@/components/analytics/source-bars";
import { Heatmap } from "@/components/analytics/heatmap";
import { RecentLeadsTable } from "@/components/analytics/recent-leads-table";

export const revalidate = 60;

function periodRange(period: string): { since: Date; until: Date } {
  const until = new Date();
  const since = new Date();
  if (period === "today") since.setHours(0, 0, 0, 0);
  else if (period === "7d") since.setDate(since.getDate() - 7);
  else if (period === "90d") since.setDate(since.getDate() - 90);
  else since.setDate(since.getDate() - 30);
  return { since, until };
}

export default async function AnalyticsPage({
  searchParams,
}: { searchParams: { period?: string; course?: string } }) {
  const profile = await requireRole(["super_admin", "admin_marketing", "marketing"]);
  const { since, until } = periodRange(searchParams.period ?? "30d");

  const [analytics, recentLeads] = await Promise.all([
    fetchAnalytics({ since, until, course: searchParams.course }),
    fetchLeads({ since: since.toISOString() }),
  ]);

  return (
    <>
      <Topbar profile={profile} title="Analytics" />
      <main className="flex-1 p-6 overflow-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total de leads"   value={analytics.total}         delta={analytics.totalDelta} />
          <KpiCard label="Taxa de conversão" value={analytics.conversion}   suffix="%" />
          <KpiCard label="Tempo até contato" value={analytics.avgContactHours} suffix="h" />
          <KpiCard label="Matriculados"     value={analytics.matriculados} />
        </div>

        <FunnelChart funnel={analytics.funnel} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LeadsTimeline data={analytics.timeline} />
          <SourceBars data={analytics.bySource} />
        </div>

        <Heatmap data={analytics.heatmap} />

        <RecentLeadsTable leads={recentLeads} />
      </main>
    </>
  );
}
