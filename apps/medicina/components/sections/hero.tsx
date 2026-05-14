import Image from "next/image";
import { config } from "@/content/medicina";
import { Formulario } from "@/components/formulario";

export function Hero() {
  const h = config.hero;

  return (
    <section className="relative min-h-[100dvh] bg-[#001a2e] text-white overflow-hidden">

      {/* ── Orbs de fundo ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orb azul principal */}
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #0096d2 0%, transparent 70%)",
            animation: "orb 10s ease-in-out infinite",
          }}
        />
        {/* Orb navy */}
        <div
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #00508c 0%, transparent 70%)",
            animation: "orb 14s ease-in-out infinite reverse",
          }}
        />
        {/* Linha diagonal decorativa */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ── Foto de fundo com overlay ──────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Estudantes de Medicina da Florence"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a2e]/95 via-[#001a2e]/80 to-[#001a2e]/60" />
      </div>

      {/* ── Conteúdo ───────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-16 lg:py-20">

        {/* Logo */}
        <div className="mb-12 lg:mb-16">
          <Image
            src="/logo.svg"
            alt="Centro Universitário Florence"
            width={280}
            height={60}
            className="brightness-0 invert opacity-90"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Coluna esquerda (3/5) ──────────────────── */}
          <div className="lg:col-span-3 flex flex-col">

            {/* Eyebrow */}
            <div className="eyebrow eyebrow-dark mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
              Medicina · São Luís, MA
            </div>

            {/* Headline */}
            <h1 className="headline-xl text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem] text-white mb-6">
              {h.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-white/65 text-lg leading-relaxed max-w-lg mb-10 font-sans">
              {h.subheadline}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-12">
              <div className="stat-pill">
                <span className="font-display font-800 text-2xl text-[#F5C842]">6 anos</span>
                <span className="text-white/45 text-xs uppercase tracking-widest font-display font-600">Duração</span>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="stat-pill">
                <span className="font-display font-800 text-2xl text-[#F5C842]">Integral</span>
                <span className="text-white/45 text-xs uppercase tracking-widest font-display font-600">Turno</span>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="stat-pill">
                <span className="font-display font-800 text-2xl text-[#F5C842]">Médicos</span>
                <span className="text-white/45 text-xs uppercase tracking-widest font-display font-600">Professores</span>
              </div>
            </div>

            {/* Formas de ingresso */}
            <div className="flex flex-wrap gap-2">
              {["Vestibular Digital", "Nota do ENEM", "FIES · ProUni", "Bolsas até 60%"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-xs font-display font-600 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Coluna direita — Formulário (2/5) ─────── */}
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <Formulario variant="sidebar" />
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex items-center gap-3 mt-16 text-white/30">
          <div className="w-px h-12 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.2em] font-display font-600">Role para saber mais</span>
        </div>
      </div>
    </section>
  );
}
