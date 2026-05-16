import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({ label, value, delta, suffix }: {
  label: string; value: string | number; delta?: number; suffix?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl border p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}{suffix && <span className="text-base text-gray-500">{suffix}</span>}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-2 inline-flex items-center gap-1 ${positive ? "text-green-600" : "text-red-600"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(delta)}% vs período anterior
        </p>
      )}
    </div>
  );
}
