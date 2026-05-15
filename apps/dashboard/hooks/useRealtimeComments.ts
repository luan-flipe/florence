"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function useRealtimeComments(leadId: string) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`lead-${leadId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `lead_id=eq.${leadId}`,
      }, () => router.refresh())
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "lead_status_history",
        filter: `lead_id=eq.${leadId}`,
      }, () => router.refresh())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [leadId, router]);
}
