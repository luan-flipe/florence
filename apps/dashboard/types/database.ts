export type LeadStatus =
  | "novo"
  | "contactado"
  | "em_conversa"
  | "matricula_iniciada"
  | "matriculado"
  | "perdido";

export type UserRole =
  | "super_admin"
  | "admin_marketing"
  | "admin_vendas"
  | "marketing"
  | "comercial";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  assigned_to: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithStatus extends Lead {
  status: LeadStatus;
  assigned_user?: { id: string; name: string | null; email: string } | null;
  comments_count?: number;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus;
  changed_by: string | null;
  changed_at: string;
  changed_by_user?: { name: string | null; email: string } | null;
}

export interface Comment {
  id: string;
  lead_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user?: { name: string | null; email: string };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  courses: string[];
  active: boolean;
}
