"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

export function StatusChanger({ leadId, current }: { leadId: string; current: LeadStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);

  async function onChange(next: LeadStatus) {
    const prev = value;
    setValue(next);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("lead_status")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("lead_id", leadId);
    setLoading(false);
    if (error) {
      setValue(prev);
      toast.error("Erro ao mudar status", { description: error.message });
      return;
    }
    router.refresh();
  }

  return (
    <select value={value} disabled={loading}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className="border rounded-md px-3 py-1.5 text-sm bg-white">
      {STAGES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
