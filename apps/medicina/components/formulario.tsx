"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/content/medicina";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z
    .string()
    .min(8, "Informe seu telefone")
    .regex(/^[\d\s\(\)\-\+]+$/, "Telefone inválido"),
});

type FormData = z.infer<typeof schema>;

interface FormularioProps {
  variant?: "sidebar" | "inline";
}

export function Formulario({ variant = "sidebar" }: FormularioProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const f = config.formulario;
  const isSidebar = variant === "sidebar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      router.push("/obrigado");
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className={isSidebar
      ? "rounded-[1.75rem] bg-white shadow-[0_24px_64px_rgba(0,26,46,0.18)] p-7 w-full"
      : "w-full max-w-lg mx-auto"
    }>
      {isSidebar && (
        <div className="mb-6">
          <h3 className="font-display font-800 text-xl text-[#001a2e] mb-1">{f.titulo}</h3>
          <p className="text-gray-400 text-sm">{f.subtitulo}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Nome */}
        <div>
          <input
            {...register("name")}
            placeholder="Nome completo"
            className="field-input"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 font-display">{errors.name.message}</p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="E-mail"
            className="field-input"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 font-display">{errors.email.message}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Celular (WhatsApp)"
            className="field-input"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1.5 font-display">{errors.phone.message}</p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-display">{error}</p>
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

        {/* LGPD */}
        <p className="text-[11px] text-gray-400 text-center leading-snug">
          {f.lgpd}
        </p>

        {/* Financiamento */}
        {f.financiamento && (
          <div className="flex items-center gap-2 justify-center bg-[#0096d2]/6 rounded-xl px-3 py-2.5">
            <span className="text-[#0096d2] text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </span>
            <p className="text-[11px] text-[#0096d2] font-display font-600 leading-snug">
              {f.financiamento}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
