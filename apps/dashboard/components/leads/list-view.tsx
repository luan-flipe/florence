import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function LeadsListView({ leads }: { leads: LeadWithStatus[] }) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-700">Nenhum lead encontrado</p>
        <p className="text-xs text-slate-400 mt-1">Ajuste os filtros ou aguarde novos cadastros.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Nome</th>
            <th className="text-left px-4 py-2">Curso</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Atribuído</th>
            <th className="text-left px-4 py-2">Criado</th>
            <th className="text-left px-4 py-2">Fonte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const stage = STAGE_BY_VALUE[lead.status] ?? STAGE_BY_VALUE.novo;
            return (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </td>
                <td className="px-4 py-2 text-gray-600">{lead.course}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${stage.color}15`, color: stage.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
                    {stage.label}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {lead.assigned_user?.name ?? lead.assigned_user?.email ?? "—"}
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {lead.utm_source ?? "direto"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
