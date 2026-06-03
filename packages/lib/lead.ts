import { Resend } from "resend";
import { supabaseAdmin } from "./supabase";
import type { LeadInput } from "./types";

export interface SubmitLeadOptions {
  /** Slug da LP de origem — gravado em leads.lp_slug. */
  lpSlug: string;
  /** Nome de exibicao usado no e-mail de confirmacao (ex: "Medicina"). */
  displayName: string;
  /** Chave Resend; default process.env.RESEND_API_KEY. */
  resendApiKey?: string;
  /** Remetente do e-mail; default "Florence <onboarding@resend.dev>". */
  fromEmail?: string;
  /** Dados extras especificos da LP (ex: { curso_interesse: "Direito" }). */
  metadata?: Record<string, unknown>;
}

/**
 * Persiste um lead no Supabase (leads.lp_slug = origem) e dispara o e-mail
 * de confirmacao (best-effort).
 */
export async function submitLead(input: LeadInput, opts: SubmitLeadOptions) {
  const { error } = await supabaseAdmin()
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      lp_slug: opts.lpSlug,
      metadata: opts.metadata ?? {},
      utm_source: input.utm_source ?? null,
      utm_medium: input.utm_medium ?? null,
      utm_campaign: input.utm_campaign ?? null,
      utm_content: input.utm_content ?? null,
      utm_term: input.utm_term ?? null,
    });

  if (error) throw error;

  // E-mail de confirmacao — BEST-EFFORT. O lead ja foi salvo; uma falha no
  // envio (ex: dominio Resend nao verificado) NAO deve derrubar a captacao.
  const apiKey = opts.resendApiKey ?? process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const firstName = input.name.split(" ")[0];
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: opts.fromEmail ?? "Florence <onboarding@resend.dev>",
      to: input.email,
      subject: `Recebemos seu cadastro para ${opts.displayName}, ${firstName}`,
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a3a6b;">Oi, ${firstName}!</h2>
        <p>Recebemos seu cadastro para <strong>${opts.displayName}</strong> do Centro Universitário Florence.</p>
        <p>Nos próximos <strong>1 dia útil</strong>, um consultor de admissões vai entrar em contato com você pelo WhatsApp ou telefone para tirar dúvidas, apresentar as opções de <strong>bolsa, FIES e ProUni</strong> disponíveis para você, e te ajudar a dar o próximo passo.</p>
        <p style="color: #666; font-size: 14px;">Qualquer urgência, é só responder este e-mail.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">Centro Universitário Florence — São Luís, MA</p>
      </div>
    `,
    });
  } catch (emailErr) {
    console.error("Lead salvo, mas falhou o e-mail de confirmacao:", emailErr);
  }
}
