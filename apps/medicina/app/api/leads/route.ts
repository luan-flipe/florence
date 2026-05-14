import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone obrigatório"),
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

    const { name, email, phone } = parsed.data;

    // Salva o lead no Supabase
    const { error: dbError } = await supabaseAdmin()
      .from("leads")
      .insert({ name, email, phone, course: "medicina" });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Erro ao salvar lead." }, { status: 500 });
    }

    // Envia e-mail de confirmação para o lead
    await resend.emails.send({
      from: "Florence <noreply@florence.edu.br>",
      to: email,
      subject: `Recebemos seu cadastro para Medicina, ${name.split(" ")[0]}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a3a6b;">Oi, ${name.split(" ")[0]}!</h2>
          <p>Recebemos seu cadastro para o curso de <strong>Medicina</strong> do Centro Universitário Florence.</p>
          <p>Nos próximos <strong>1 dia útil</strong>, um consultor de admissões vai entrar em contato com você pelo WhatsApp ou telefone para tirar dúvidas, apresentar as opções de <strong>bolsa, FIES e ProUni</strong> disponíveis para você, e te ajudar a dar o próximo passo.</p>
          <p style="color: #666; font-size: 14px;">Qualquer urgência, é só responder este e-mail.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 13px;">Centro Universitário Florence — São Luís, MA</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
