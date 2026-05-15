import type { LeadWithStatus } from "@/types/database";
export function LeadsListView({ leads }: { leads: LeadWithStatus[] }) {
  return <div>Lista com {leads.length} leads (em construção)</div>;
}
