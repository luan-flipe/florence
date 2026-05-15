import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { fetchLeadById, fetchLeadHistory, fetchLeadComments } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { LeadDetail } from "@/components/leads/lead-detail";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(["super_admin", "admin_vendas", "comercial"]);

  let lead, history, comments;
  try {
    [lead, history, comments] = await Promise.all([
      fetchLeadById(params.id),
      fetchLeadHistory(params.id),
      fetchLeadComments(params.id),
    ]);
  } catch {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <>
      <Topbar profile={profile} title="Detalhes do lead" />
      <LeadDetail
        lead={lead as never}
        history={history as never}
        comments={comments as never}
        profile={profile}
      />
    </>
  );
}
