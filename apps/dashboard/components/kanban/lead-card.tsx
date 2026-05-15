"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function LeadCard({ lead }: { lead: LeadWithStatus }) {
  const stage = STAGE_BY_VALUE[lead.status] ?? STAGE_BY_VALUE.novo;
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="block bg-white rounded-lg border-l-4 border border-gray-200 p-3 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: stage.color }}
    >
      <p className="font-medium text-sm text-gray-900 truncate">{lead.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {lead.course} · {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
      </p>
      <p className="text-xs text-gray-400 mt-1 truncate">📞 {lead.phone}</p>

      {lead.utm_source && (
        <p className="text-[10px] text-gray-400 mt-1 truncate">{lead.utm_source} · {lead.utm_campaign}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <MessageCircle size={12} /> {lead.comments_count ?? 0}
        </span>
        {lead.assigned_user && (
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
            {lead.assigned_user.name?.split(" ")[0] ?? lead.assigned_user.email.split("@")[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
