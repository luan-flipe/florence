import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

export function FunnelChart({ funnel }: { funnel: Record<LeadStatus, number> }) {
  // Funil de progressão (exclui perdido)
  const stages = STAGES.filter((s) => s.value !== "perdido");
  const total = stages.reduce((sum, s) => sum + funnel[s.value], 0);
  const max = Math.max(...stages.map((s) => funnel[s.value]));

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Funil de conversão</h3>
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const count = funnel[stage.value];
          const width = max > 0 ? (count / max) * 100 : 0;
          const pctTotal = total > 0 ? (count / total) * 100 : 0;
          const prev = i > 0 ? funnel[stages[i - 1].value] : null;
          const pctProgression = prev && prev > 0 ? (count / prev) * 100 : null;
          return (
            <div key={stage.value}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{stage.label}</span>
                <span className="text-gray-500">
                  {count} · {Math.round(pctTotal)}%
                  {pctProgression !== null && <span className="text-gray-400 ml-2">({Math.round(pctProgression)}% avanço)</span>}
                </span>
              </div>
              <div className="h-6 bg-gray-100 rounded">
                <div className="h-6 rounded transition-all" style={{ width: `${width}%`, background: stage.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
