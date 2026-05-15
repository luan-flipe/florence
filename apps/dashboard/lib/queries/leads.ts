import { createClient } from "@/lib/supabase-server";
import type { LeadWithStatus, LeadStatus } from "@/types/database";

export interface LeadsFilter {
  course?: string;
  statuses?: LeadStatus[];
  assignedTo?: string;
  search?: string;
  since?: string; // ISO date
}

export async function fetchLeads(filter: LeadsFilter = {}): Promise<LeadWithStatus[]> {
  const supabase = createClient();
  let query = supabase
    .from("leads")
    .select(`
      *,
      lead_status!inner(status),
      assigned_user:user_profiles!leads_assigned_to_fkey(id, name, email),
      comments(count)
    `)
    .order("created_at", { ascending: false });

  if (filter.course)     query = query.eq("course", filter.course);
  if (filter.assignedTo) query = query.eq("assigned_to", filter.assignedTo);
  if (filter.since)      query = query.gte("created_at", filter.since);
  if (filter.search) {
    query = query.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let leads = (data ?? []).map((row: any) => ({
    ...row,
    status: row.lead_status[0]?.status as LeadStatus,
    comments_count: row.comments[0]?.count ?? 0,
  })) as LeadWithStatus[];

  if (filter.statuses && filter.statuses.length > 0) {
    leads = leads.filter((l) => filter.statuses!.includes(l.status));
  }

  return leads;
}

export async function fetchLeadById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      lead_status!inner(status),
      assigned_user:user_profiles!leads_assigned_to_fkey(id, name, email)
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    ...data,
    status: data.lead_status[0]?.status,
  };
}

export async function fetchLeadHistory(leadId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_status_history")
    .select(`*, changed_by_user:user_profiles!lead_status_history_changed_by_fkey(name, email)`)
    .eq("lead_id", leadId)
    .order("changed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchLeadComments(leadId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(`*, user:user_profiles!comments_user_id_fkey(name, email)`)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
