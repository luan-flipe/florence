"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/content/medicina";
// TODO: descomentar quando rolar nova campanha de escassez
// import { ScarcitySeal } from "@/components/scarcity-seal";

// Máscara de celular brasileiro: (XX) XXXXX-XXXX
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// Contagem de dígitos puros para validação
const digitCount = (s: string) => s.replace(/\D/g, "").length;

const schema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido"),
  phone: z
    .string()
    .refine((v) => digitCount(v) === 11, "Informe um celular com DDD (11 dígitos)"),
});

type FormData = z.infer<typeof schema>;

interface FormularioProps {
  variant?: "sidebar" | "inline";
  utm?: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
  };
}

export function Formulario({ variant = "sidebar", utm }: FormularioProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const f = config.formulario;
  const isSidebar = variant === "sidebar";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...(utm ?? {}) }),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      router.push("/obrigado");
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  };

  // Registro do phone com mascara aplicada no onChange
  const phoneReg = register("phone");

  return (
    <div className={isSidebar
      ? "relative rounded-[1.75rem] bg-white shadow-[0_24px_64px_rgba(0,26,46,0.18)] p-7 w-full"
      : "w-full max-w-lg mx-auto"
    }>
      {/* TODO: descomentar quando rolar nova campanha de escassez */}
      {/* {isSidebar && <ScarcitySeal />} */}
      {isSidebar && (
        <div className="mb-6 pb-5 border-b border-gray-100">
          {/* Badge — contraste aumentado: fundo mais saturado, texto mais escuro */}
          <div className="inline-flex items-center gap-1.5 bg-[#0096d2]/15 border border-[#0096d2]/35 text-[#005a82] rounded-full px-3 py-1 text-[10px] font-display font-700 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005a82] animate-pulse" />
            Vagas abertas
          </div>
          {/* h2 ao invés de h3 — corrige hierarquia para acessibilidade */}
          <h2 className="font-display font-800 text-3xl lg:text-[2rem] text-[#001a2e] leading-[1.05] tracking-tight mb-2">
            {f.titulo}
          </h2>
          <p className="text-gray-600 text-sm">{f.subtitulo}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Nome */}
        <div>
          <input
            {...register("name")}
            placeholder="Nome completo"
            autoComplete="name"
            className="field-input"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1.5 font-display">{errors.name.message}</p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <input
            {...register("email", {
              setValueAs: (v: string) => v.trim().toLowerCase(),
            })}
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            inputMode="email"
            className="field-input"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1.5 font-display">{errors.email.message}</p>
          )}
        </div>

        {/* Telefone com máscara (XX) XXXXX-XXXX */}
        <div>
          <input
            {...phoneReg}
            type="tel"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={15}
            onChange={(e) => {
              const masked = formatPhone(e.target.value);
              e.target.value = masked;
              setValue("phone", masked, { shouldValidate: false });
              phoneReg.onChange(e);
            }}
            className="field-input"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1.5 font-display">{errors.phone.message}</p>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center font-display">{error}</p>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{loading ? "Enviando..." : f.cta}</span>
          {!loading && (
            <span className="btn-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          )}
        </button>

        {/* LGPD — contraste aumentado (gray-600 atende WCAG AA em fundo branco) */}
        <p className={`text-[11px] text-center leading-snug ${isSidebar ? "text-gray-600" : "text-white/80"}`}>
          {f.lgpd}
        </p>

        {/* Edital — link para PDF do vestibular 2026.2 */}
        {f.edital && (
          <a
            href={f.edital.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-2 justify-center rounded-xl px-3 py-2.5 transition-colors
              ${isSidebar
                ? "bg-[#0096d2]/10 hover:bg-[#0096d2]/20 text-[#005a82]"
                : "bg-white/15 hover:bg-white/25 text-white"}`}
          >
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <line x1="9" y1="11" x2="15" y2="11" />
              </svg>
            </span>
            <span className="text-[11px] font-display font-700 leading-snug">
              {f.edital.label}
            </span>
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </form>
    </div>
  );
}
