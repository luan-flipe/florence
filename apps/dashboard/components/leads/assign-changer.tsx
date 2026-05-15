"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";

interface Props {
  leadId: string;
  currentAssignedId: string | null;
  canAssign: boolean;
}

export function AssignChanger({ leadId, currentAssignedId, canAssign }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string }[]>([]);
  const [value, setValue] = useState(currentAssignedId ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canAssign) return;
    const supabase = createClient();
    supabase
      .from("user_profiles")
      .select("id, name, email")
      .in("role", ["comercial", "admin_vendas"])
      .eq("active", true)
      .then(({ data }) => setUsers(data ?? []));
  }, [canAssign]);

  if (!canAssign) {
    return (
      <span className="text-sm text-gray-700">
        {currentAssignedId ? "—" : "Não atribuído"}
      </span>
    );
  }

  async function onChange(next: string) {
    const prev = value;
    setValue(next);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ assigned_to: next || null })
      .eq("id", leadId);
    setLoading(false);
    if (error) {
      setValue(prev);
      toast.error("Erro ao atribuir", { description: error.message });
      return;
    }
    router.refresh();
  }

  return (
    <select value={value} disabled={loading}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md px-3 py-1.5 text-sm bg-white">
      <option value="">Não atribuído</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
      ))}
    </select>
  );
}
