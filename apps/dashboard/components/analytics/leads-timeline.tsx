"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export function LeadsTimeline({ data }: { data: { day: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Leads por dia</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tickFormatter={(v) => format(parseISO(v), "dd/MM")} fontSize={11} />
          <YAxis fontSize={11} allowDecimals={false} />
          <Tooltip labelFormatter={(v) => format(parseISO(v), "dd/MM/yyyy")} />
          <Line type="monotone" dataKey="count" stroke="#0096d2" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
