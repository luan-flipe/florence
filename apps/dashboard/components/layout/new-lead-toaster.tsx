"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";

export function NewLeadToaster() {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("new-leads-global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as { name?: string; course?: string };
          toast.success("🆕 Novo lead", {
            description: `${lead.name ?? "Sem nome"} — ${lead.course ?? "—"}`,
            duration: 6000,
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return null;
}
