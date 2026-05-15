import type { LeadStatus } from "@/types/database";

export const STAGES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "novo",               label: "Novo",               color: "#0096d2" },
  { value: "contactado",         label: "Contactado",         color: "#0072a3" },
  { value: "em_conversa",        label: "Em conversa",        color: "#005a82" },
  { value: "matricula_iniciada", label: "Matrícula iniciada", color: "#f5c842" },
  { value: "matriculado",        label: "Matriculado",        color: "#22c55e" },
  { value: "perdido",            label: "Perdido",            color: "#ef4444" },
];

export const STAGE_BY_VALUE = Object.fromEntries(
  STAGES.map((s) => [s.value, s])
) as Record<LeadStatus, (typeof STAGES)[number]>;
