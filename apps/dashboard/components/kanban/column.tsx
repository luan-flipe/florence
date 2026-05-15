"use client";
import type { LeadWithStatus, LeadStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";
import { LeadCard } from "./lead-card";

export function KanbanColumn({ status, leads }: { status: LeadStatus; leads: LeadWithStatus[] }) {
  const stage = STAGE_BY_VALUE[status];
  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 flex flex-col" data-column={status}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
          {stage.label}
        </h3>
        <span className="text-xs text-gray-500">{leads.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
      </div>
    </div>
  );
}
