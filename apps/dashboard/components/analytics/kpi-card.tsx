import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({ label, value, delta, suffix }: {
  label: string; value: string | number; delta?: number; suffix?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5
      shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.06)]
      hover:border-slate-300 transition-colors duration-300">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-slate-900 mt-3 font-mono tabular-nums">
        {value}
        {suffix && <span className="text-lg text-slate-400 ml-0.5">{suffix}</span>}
      </p>
      {delta !== undefined && (
        <p className={`text-xs mt-3 inline-flex items-center gap-1 font-medium
          ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="font-mono tabular-nums">{Math.abs(delta)}%</span>
          <span className="text-slate-400 font-normal ml-1">vs período anterior</span>
        </p>
      )}
    </div>
  );
}
