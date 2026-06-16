import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitLead } from "@florence/lib/lead";
import { resolveLp } from "@/lib/registry";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone obrigatório"),
  curso_interesse: z.string().optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const entry = resolveLp(req.headers.get("host"));

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { curso_interesse, ...lead } = parsed.data;
    await submitLead(lead, {
      lpSlug: entry.slug,
      displayName: entry.displayName,
      metadata: curso_interesse ? { curso_interesse } : {},
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Erro ao salvar lead." }, { status: 500 });
  }
}
