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

  const isInline = variant === "inline";

  return (
    <div
      className={
        isInline
          ? "w-full max-w-xl mx-auto"
          : "bg-white rounded-2xl shadow-xl p-6 w-full"
      }
    >
      {!isInline && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{f.titulo}</h3>
          <p className="text-sm text-gray-500 mb-5">{f.subtitulo}</p>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("name")}
            placeholder="Nome completo"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="E-mail"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Celular (WhatsApp)"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
        >
          {loading ? "Enviando..." : f.cta}
        </button>

        <p className="text-xs text-gray-400 text-center leading-snug">
          {f.lgpd}
        </p>

        {f.financiamento && (
          <p className="text-xs text-blue-600 font-medium text-center leading-snug border-t border-gray-100 pt-3">
            {f.financiamento}
          </p>
        )}
      </form>
    </div>
  );
}
