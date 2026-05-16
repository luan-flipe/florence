import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase-server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(["super_admin", "admin_marketing", "admin_vendas", "marketing", "comercial"]),
  courses: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (!profile || !["super_admin", "admin_marketing", "admin_vendas"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Restringir o role que cada admin pode criar
  if (profile.role === "admin_marketing" && !["marketing", "admin_marketing"].includes(parsed.data.role)) {
    return NextResponse.json({ error: "Cannot create this role" }, { status: 403 });
  }
  if (profile.role === "admin_vendas" && !["comercial", "admin_vendas"].includes(parsed.data.role)) {
    return NextResponse.json({ error: "Cannot create this role" }, { status: 403 });
  }

  // Senha temporária aleatória
  const tempPassword = crypto.randomUUID().slice(0, 12);

  // Cria usuário no Supabase Auth (admin client bypassa RLS)
  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: tempPassword,
    email_confirm: true,
  });
  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

  // Cria profile
  const { error: profileError } = await admin.from("user_profiles").insert({
    id: created.user.id,
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role,
    courses: parsed.data.courses,
    active: true,
  });
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  // E-mail com senha temporária via Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Florence <onboarding@resend.dev>",
    to: parsed.data.email,
    subject: "Sua conta no Dashboard Florence foi criada",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2>Bem-vindo, ${parsed.data.name}!</h2>
        <p>Sua conta no Dashboard Florence foi criada.</p>
        <p><strong>E-mail:</strong> ${parsed.data.email}</p>
        <p><strong>Senha temporária:</strong> <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;">${tempPassword}</code></p>
        <p>Acesse <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">${process.env.NEXT_PUBLIC_APP_URL}/login</a> e altere sua senha após o primeiro login.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
