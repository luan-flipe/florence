/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // 1. Fetch leads (without embedded joins)
  let leadsQuery = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.course)     leadsQuery = leadsQuery.eq("course", filter.course);
  if (filter.assignedTo) leadsQuery = leadsQuery.eq("assigned_to", filter.assignedTo);
  if (filter.since)      leadsQuery = leadsQuery.gte("created_at", filter.since);
  if (filter.search) {
    leadsQuery = leadsQuery.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`);
  }

  const { data: leadsData, error: leadsError } = await leadsQuery;
  if (leadsError) throw leadsError;
  if (!leadsData || leadsData.length === 0) return [];

  const leadIds = leadsData.map((l) => l.id);
  const assignedIds = leadsData
    .map((l) => l.assigned_to)
    .filter((id): id is string => id !== null);

  // 2. Fetch lead_status for these leads (one row per lead)
  const { data: statusData } = await supabase
    .from("lead_status")
    .select("lead_id, status")
    .in("lead_id", leadIds);
  const statusMap = new Map((statusData ?? []).map((s: any) => [s.lead_id, s.status]));

  // 3. Fetch assigned users
  let usersMap = new Map();
  if (assignedIds.length > 0) {
    const { data: usersData } = await supabase
      .from("user_profiles")
      .select("id, name, email")
      .in("id", assignedIds);
    usersMap = new Map((usersData ?? []).map((u: any) => [u.id, u]));
  }

  // 4. Fetch comments count per lead
  const { data: commentsData } = await supabase
    .from("comments")
    .select("lead_id")
    .in("lead_id", leadIds);
  const commentCounts = new Map<string, number>();
  (commentsData ?? []).forEach((c: any) => {
    commentCounts.set(c.lead_id, (commentCounts.get(c.lead_id) ?? 0) + 1);
  });

  // 5. Merge
  let leads = leadsData.map((row: any) => ({
    ...row,
    status: (statusMap.get(row.id) ?? "novo") as LeadStatus,
    assigned_user: row.assigned_to ? usersMap.get(row.assigned_to) ?? null : null,
    comments_count: commentCounts.get(row.id) ?? 0,
  })) as LeadWithStatus[];

  if (filter.statuses && filter.statuses.length > 0) {
    leads = leads.filter((l) => filter.statuses!.includes(l.status));
  }

  return leads;
}

export async function fetchLeadById(id: string) {
  const supabase = createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  // Status separado
  const { data: statusRow } = await supabase
    .from("lead_status")
    .select("status")
    .eq("lead_id", id)
    .maybeSingle();

  // Assigned user separado
  let assigned_user = null;
  if (lead.assigned_to) {
    const { data: user } = await supabase
      .from("user_profiles")
      .select("id, name, email")
      .eq("id", lead.assigned_to)
      .maybeSingle();
    assigned_user = user;
  }

  return {
    ...lead,
    status: statusRow?.status ?? "novo",
    assigned_user,
  };
}

export async function fetchLeadHistory(leadId: string) {
  const supabase = createClient();

  const { data: history, error } = await supabase
    .from("lead_status_history")
    .select("*")
    .eq("lead_id", leadId)
    .order("changed_at", { ascending: false });
  if (error) throw error;
  if (!history || history.length === 0) return [];

  // Carrega users que mudaram status
  const userIds = history
    .map((h: any) => h.changed_by)
    .filter((id: string | null): id is string => id !== null);

  let usersMap = new Map();
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("user_profiles")
      .select("id, name, email")
      .in("id", userIds);
    usersMap = new Map((users ?? []).map((u: any) => [u.id, u]));
  }

  return history.map((h: any) => ({
    ...h,
    changed_by_user: h.changed_by ? usersMap.get(h.changed_by) ?? null : null,
  }));
}

export async function fetchLeadComments(leadId: string) {
  const supabase = createClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!comments || comments.length === 0) return [];

  const userIds = Array.from(new Set(comments.map((c: any) => c.user_id)));
  const { data: users } = await supabase
    .from("user_profiles")
    .select("id, name, email")
    .in("id", userIds);
  const usersMap = new Map((users ?? []).map((u: any) => [u.id, u]));

  return comments.map((c: any) => ({
    ...c,
    user: usersMap.get(c.user_id) ?? null,
  }));
}
