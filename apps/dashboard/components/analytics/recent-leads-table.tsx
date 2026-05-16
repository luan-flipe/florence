import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function RecentLeadsTable({ leads }: { leads: LeadWithStatus[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Últimos leads</h3>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {leads.slice(0, 10).map((lead) => {
            const stage = STAGE_BY_VALUE[lead.status] ?? STAGE_BY_VALUE.novo;
            return (
              <tr key={lead.id}>
                <td className="py-2 font-medium">{lead.name}</td>
                <td className="py-2 text-gray-500">{lead.course}</td>
                <td className="py-2 text-gray-500 text-xs">{lead.utm_source ?? "direto"}</td>
                <td className="py-2 text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
                </td>
                <td className="py-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${stage.color}20`, color: stage.color }}>
                    {stage.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
