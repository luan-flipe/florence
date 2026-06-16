import { Formulario } from "@florence/ui/formulario";
import Image from "next/image";
import { config } from "@/content/medicina";
import type { UtmParams } from "@florence/umbrella";

export function Hero({ utm }: { utm?: UtmParams }) {
  const h = config.hero;

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
          src="/images/medicina/hero.jpg"
          alt="Estudante de Medicina da Florence"
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
              Medicina · São Luís, MA
            </div>

            <h1 className="headline-xl text-4xl md:text-5xl lg:text-[3.5rem] text-white mb-5
              [text-shadow:_0_2px_32px_rgba(0,26,46,0.5)]">
              {h.headline}
            </h1>

            <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-md mb-8
              [text-shadow:_0_1px_16px_rgba(0,26,46,0.4)]">
              {h.subheadline}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-5 sm:gap-8 mb-8">
              {h.stats.map((s, i) => (
                <div key={s.label}>
                  {i > 0 && <div className="w-px h-10 bg-white/15 -ml-8 mr-0 absolute hidden" />}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-display font-800 text-xl sm:text-2xl text-[#F5C842] whitespace-nowrap">{s.value}</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest font-display font-600">{s.label}</span>
                  </div>
                </div>
              )).reduce<React.ReactNode[]>((acc, el, i) => {
                if (i > 0) acc.push(<div key={`sep-${i}`} className="w-px h-10 bg-white/15" />);
                acc.push(el);
                return acc;
              }, [])}
            </div>

            {/* Tags de ingresso */}
            <div className="flex flex-wrap gap-2">
              {h.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-xs font-display font-600 tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Direita — Formulário (5/12) ────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <Formulario copy={config.formulario} variant="sidebar" utm={utm} formId="form-hero" formName="form-hero" />
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
