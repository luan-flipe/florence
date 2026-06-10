"use client";
import Image from "next/image";
import { Formulario } from "@florence/ui/formulario";
import { config, cursoOptions } from "@/content/tecnico";
import { useCursoInteresse } from "@/components/curso-interesse-context";
import type { UtmParams } from "@/app/page";

export function Hero({ utm }: { utm?: UtmParams }) {
  const h = config.hero;
  const { curso, setCurso } = useCursoInteresse();

  return (
    <section className="relative min-h-[100dvh] bg-[#001a2e] text-white overflow-hidden">

      {/* ── Orbs de fundo ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 right-1/3 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #0096d2 0%, transparent 70%)", animation: "orb 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00508c 0%, transparent 70%)", animation: "orb 14s ease-in-out infinite reverse" }}
        />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "24px 24px" }}
        />
      </div>

      {/* ── Foto de fundo ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Formação técnica na Florence"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover object-[35%_center] lg:object-[55%_center]
            scale-[1.15] origin-bottom
            lg:scale-100 lg:origin-center"
          priority
        />

        {/* Gradiente horizontal — bem mais leve para revelar a pessoa */}
        <div className="absolute inset-0
          bg-gradient-to-r from-[#001a2e]/95 via-[#001a2e]/15 to-transparent" />

        {/* Contraste sutil topo (apenas a partir do topo, não escurece base) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001a2e]/15 via-transparent to-transparent" />

        {/* Mobile: fade do bg escuro para cream — efeito de form flutuando além do hero */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-[55%] pointer-events-none
          bg-gradient-to-b from-transparent via-[#F8F9FA]/55 to-[#F8F9FA]" />
      </div>

      {/* ── Conteúdo ───────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12 lg:py-16">

        {/* Logo */}
        <div className="mb-10 lg:mb-12">
          <Image src="/logo.svg" alt="Centro Universitário Florence" width={240} height={52} className="brightness-0 invert opacity-90" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start lg:items-center">

          {/* ── Esquerda (7/12) ────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="eyebrow eyebrow-dark mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
              {h.eyebrow}
            </div>

            <h1 className="headline-xl text-4xl md:text-5xl lg:text-[3.5rem] text-white mb-5
              [text-shadow:_0_2px_32px_rgba(0,26,46,0.5)]">
              {h.headline}
            </h1>

            <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-md mb-8
              [text-shadow:_0_1px_16px_rgba(0,26,46,0.4)]">
              {h.subheadline}
            </p>

            {/* Stat line discreta (NAO hero-metric template) */}
            <div className="flex items-center gap-4 text-sm text-white/70 font-display">
              {h.stats.map((s, i) => (
                <span key={s.label} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
                  <span className="font-700 text-[#F5C842]">{s.value}</span> {s.label}
                </span>
              ))}
            </div>

            {config.prazo.ativo && (
              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#F5C842]/12 border border-[#F5C842]/25 px-3 py-1.5 text-[#F5C842] text-xs font-display font-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
                {config.prazo.texto}
              </div>
            )}
          </div>

          {/* ── Direita — Formulário (5/12) ────────────── */}
          <div id="lead-form" className="lg:col-span-5 lg:sticky lg:top-8 scroll-mt-8">
            <Formulario
              copy={config.formulario}
              variant="sidebar"
              utm={utm}
              formId="form-hero"
              formName="form-hero"
              extraFields={[{ name: "curso_interesse", label: config.formulario.cursoLabel, type: "select", options: cursoOptions, required: true, placeholder: config.formulario.cursoPlaceholder }]}
              extraValues={{ curso_interesse: curso }}
              onExtraChange={(_, v) => setCurso(v)}
            />
          </div>
        </div>

        {/* Scroll indicator com ícone de mouse */}
        <div className="hidden lg:flex items-center gap-3 mt-14 text-white/30">
          {/* Ícone mouse animado */}
          <div className="relative w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div
              className="w-1 h-1.5 rounded-full bg-white/50"
              style={{ animation: "scrollDot 1.8s cubic-bezier(0.45,0,0.55,1) infinite" }}
            />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-display font-600">Role para saber mais</span>
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%   { transform: translateY(0); opacity: 1; }
          60%  { transform: translateY(10px); opacity: 0.2; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
