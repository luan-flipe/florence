import type { LeadWithStatus } from "@/types/database";
export function KanbanBoard({ leads }: { leads: LeadWithStatus[]; canEdit: boolean }) {
  return <div>Kanban com {leads.length} leads (em construção)</div>;
}
