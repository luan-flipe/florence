import type { UserRole } from "@/types/database";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:      "Super Admin",
  admin_marketing:  "Admin Marketing",
  admin_vendas:     "Admin Vendas",
  marketing:        "Marketing",
  comercial:        "Comercial",
};

export function canAccessAnalytics(role: UserRole): boolean {
  return ["super_admin", "admin_marketing", "marketing"].includes(role);
}

export function canAccessLeads(role: UserRole): boolean {
  return ["super_admin", "admin_vendas", "comercial"].includes(role);
}

export function canManageTeam(role: UserRole): boolean {
  return ["super_admin", "admin_marketing", "admin_vendas"].includes(role);
}

export function canChangeLeadStatus(role: UserRole): boolean {
  return ["super_admin", "admin_vendas", "comercial"].includes(role);
}

export function canAssignLeads(role: UserRole): boolean {
  return ["super_admin", "admin_vendas"].includes(role);
}
