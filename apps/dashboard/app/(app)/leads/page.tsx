import { requireRole } from "@/lib/auth";
import { fetchLeads, type LeadsFilter } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { LeadsFilters } from "@/components/leads/filters";
import { ViewToggle } from "@/components/leads/view-toggle";
import { KanbanBoard } from "@/components/kanban/board";
import { LeadsListView } from "@/components/leads/list-view";
import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

function periodToDate(period: string): string | undefined {
  const now = new Date();
  if (period === "today") return new Date(now.setHours(0, 0, 0, 0)).toISOString();
  if (period === "7d")    { now.setDate(now.getDate() - 7);  return now.toISOString(); }
  if (period === "30d")   { now.setDate(now.getDate() - 30); return now.toISOString(); }
  return undefined;
}

export default async function LeadsPage({
  searchParams,
}: { searchParams: { q?: string; period?: string; status?: string; course?: string } }) {
  const profile = await requireRole(["super_admin", "admin_vendas", "comercial"]);

  const filter: LeadsFilter = {
    course:    searchParams.course,
    search:    searchParams.q,
    since:     periodToDate(searchParams.period ?? "30d"),
    statuses:
      !searchParams.status || searchParams.status === "active"
        ? (STAGES.filter((s) => s.value !== "perdido").map((s) => s.value) as LeadStatus[])
        : searchParams.status === "all"
          ? undefined
          : ([searchParams.status as LeadStatus]),
  };

  // Para comercial, restringe a cursos atribuídos
  if (profile.role === "comercial" && profile.courses.length > 0) {
    if (filter.course && !profile.courses.includes(filter.course)) {
      filter.course = profile.courses[0];
    }
  }

  const leads = await fetchLeads(filter);

  return (
    <>
      <Topbar profile={profile} title="Leads" />
      <main className="flex-1 p-6 overflow-auto">
        <LeadsFilters />
        <ViewToggle>
          <KanbanBoard leads={leads} canEdit={true} />
          <LeadsListView leads={leads} />
        </ViewToggle>
      </main>
    </>
  );
}
