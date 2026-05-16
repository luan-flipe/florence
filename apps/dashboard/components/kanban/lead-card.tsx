"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Phone } from "lucide-react";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function LeadCard({ lead }: { lead: LeadWithStatus }) {
  const stage = STAGE_BY_VALUE[lead.status] ?? STAGE_BY_VALUE.novo;
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="group block bg-white rounded-xl border border-slate-200/80 p-3
        transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:border-slate-300 hover:-translate-y-0.5
        hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]
        active:translate-y-0 active:scale-[0.99]"
      style={{ borderLeftWidth: 3, borderLeftColor: stage.color }}
    >
      <p className="font-medium text-sm text-slate-900 truncate group-hover:text-slate-950">
        {lead.name}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {lead.course} <span className="text-slate-300">·</span>{" "}
        <span className="font-mono">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}</span>
      </p>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
        <Phone size={11} />
        <span className="font-mono tabular-nums truncate">{lead.phone}</span>
      </div>

      {lead.utm_source && (
        <p className="text-[10px] text-slate-400 mt-1.5 truncate font-mono">
          {lead.utm_source}{lead.utm_campaign && ` · ${lead.utm_campaign}`}
        </p>
      )}

      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MessageCircle size={11} />
          <span className="font-mono tabular-nums">{lead.comments_count ?? 0}</span>
        </span>
        {lead.assigned_user && (
          <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
            {lead.assigned_user.name?.split(" ")[0] ?? lead.assigned_user.email.split("@")[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
