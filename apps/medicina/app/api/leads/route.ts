import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitLead } from "@florence/lib/lead";

const LP_SLUG = process.env.NEXT_PUBLIC_LP_SLUG ?? "medicina";
const LP_DISPLAY_NAME = process.env.LP_DISPLAY_NAME ?? "Medicina";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone obrigatório"),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await submitLead(parsed.data, {
      lpSlug: LP_SLUG,
      displayName: LP_DISPLAY_NAME,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Erro ao salvar lead." }, { status: 500 });
  }
}
