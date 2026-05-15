"use client";
import { useState, useMemo, useEffect } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LeadWithStatus, LeadStatus } from "@/types/database";
import { STAGES, STAGE_BY_VALUE } from "@/lib/stages";
import { LeadCard } from "./lead-card";
import { createClient } from "@/lib/supabase-client";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";

function SortableLeadCard({ lead }: { lead: LeadWithStatus }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { status: lead.status },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} />
    </div>
  );
}

function DroppableColumn({ status, leads }: { status: LeadStatus; leads: LeadWithStatus[] }) {
  const stage = STAGE_BY_VALUE[status];
  const { setNodeRef } = useSortable({ id: `column-${status}`, data: { type: "column", status } });
  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 flex flex-col" data-column={status}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
          {stage.label}
        </h3>
        <span className="text-xs text-gray-500">{leads.length}</span>
      </div>
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto min-h-[100px]">
          {leads.map((lead) => <SortableLeadCard key={lead.id} lead={lead} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ leads, canEdit }: { leads: LeadWithStatus[]; canEdit: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState(leads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Sincroniza com props quando vêm novas leads (refresh do servidor / realtime)
  useEffect(() => { setItems(leads); }, [leads]);

  // Realtime: refresca quando outro user move um lead ou novo lead é capturado
  useRealtimeLeads();

  const grouped = useMemo(() => {
    const map = new Map(STAGES.map((s) => [s.value, [] as LeadWithStatus[]]));
    items.forEach((l) => map.get(l.status)?.push(l));
    return map;
  }, [items]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!canEdit || !e.over) return;

    const leadId = String(e.active.id);
    const overId = String(e.over.id);

    const newStatus: LeadStatus | null = overId.startsWith("column-")
      ? (overId.replace("column-", "") as LeadStatus)
      : (e.over.data.current?.status as LeadStatus | undefined) ?? null;

    if (!newStatus) return;
    const lead = items.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setItems((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const supabase = createClient();
    const { error } = await supabase
      .from("lead_status")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("lead_id", leadId);

    if (error) {
      // Rollback
      setItems((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)));
      toast.error("Erro ao mover lead", { description: error.message });
      return;
    }
    router.refresh();
  }

  const activeLead = items.find((l) => l.id === activeId);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:snap-none">
        {STAGES.map((stage) => (
          <div key={stage.value} className="snap-start min-w-[85vw] md:min-w-0">
            <DroppableColumn status={stage.value} leads={grouped.get(stage.value) ?? []} />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeLead && <LeadCard lead={activeLead} />}
      </DragOverlay>
    </DndContext>
  );
}
