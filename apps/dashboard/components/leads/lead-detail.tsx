"use client";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import type { LeadWithStatus, LeadStatusHistory, Comment, UserProfile } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";
import { canAssignLeads } from "@/lib/roles";
import { StatusChanger } from "./status-changer";
import { AssignChanger } from "./assign-changer";
import { CommentForm } from "./comment-form";

interface Props {
  lead: LeadWithStatus;
  history: LeadStatusHistory[];
  comments: Comment[];
  profile: UserProfile;
}

export function LeadDetail({ lead, history, comments, profile }: Props) {
  const stage = STAGE_BY_VALUE[lead.status];
  const cleanPhone = lead.phone.replace(/\D/g, "");
  const whatsapp = `https://wa.me/55${cleanPhone}`;
  const tel = `tel:+55${cleanPhone}`;

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Voltar para Leads
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{lead.email}</p>
              <p className="text-sm text-gray-500">{lead.phone}</p>
              <div className="flex gap-2 mt-3">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg">
                  <MessageSquare size={14} /> WhatsApp
                </a>
                <a href={tel}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg">
                  <Phone size={14} /> Ligar
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                style={{ background: `${stage.color}20`, color: stage.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                {stage.label}
              </span>
              <StatusChanger leadId={lead.id} current={lead.status} />
            </div>
          </div>
        </div>

        {/* Dados */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Dados do lead</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Curso</dt><dd>{lead.course}</dd></div>
            <div><dt className="text-gray-500">Criado em</dt>
              <dd>{format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</dd></div>
            <div><dt className="text-gray-500">UTM Source</dt><dd>{lead.utm_source ?? "—"}</dd></div>
            <div><dt className="text-gray-500">UTM Campaign</dt><dd>{lead.utm_campaign ?? "—"}</dd></div>
            <div><dt className="text-gray-500">UTM Medium</dt><dd>{lead.utm_medium ?? "—"}</dd></div>
            <div>
              <dt className="text-gray-500">Atribuído a</dt>
              <dd className="mt-1">
                <AssignChanger leadId={lead.id} currentAssignedId={lead.assigned_to}
                  canAssign={canAssignLeads(profile.role)} />
              </dd>
            </div>
          </dl>
        </section>

        {/* Histórico */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Histórico de status</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">Sem histórico.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {history.map((h) => (
                <li key={h.id} className="flex items-start gap-3">
                  <span className="text-gray-400 text-xs whitespace-nowrap mt-0.5">
                    {format(new Date(h.changed_at), "dd/MM HH:mm", { locale: ptBR })}
                  </span>
                  <span>
                    {h.from_status
                      ? <>De <strong>{STAGE_BY_VALUE[h.from_status].label}</strong> para <strong>{STAGE_BY_VALUE[h.to_status].label}</strong></>
                      : <>Criado como <strong>{STAGE_BY_VALUE[h.to_status].label}</strong></>}
                    {h.changed_by_user && <> por {h.changed_by_user.name ?? h.changed_by_user.email}</>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Comentários */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Comentários ({comments.length})</h2>
          <CommentForm leadId={lead.id} />
          {comments.length === 0
            ? <p className="text-sm text-gray-500 mt-4">Sem comentários ainda.</p>
            : <ul className="space-y-3 text-sm mt-4">
                {comments.map((c) => (
                  <li key={c.id} className="border-l-2 border-blue-200 pl-3">
                    <p className="text-xs text-gray-500">
                      {c.user?.name ?? c.user?.email ?? "—"} ·{" "}
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{c.text}</p>
                  </li>
                ))}
              </ul>}
        </section>
      </div>
    </main>
  );
}
