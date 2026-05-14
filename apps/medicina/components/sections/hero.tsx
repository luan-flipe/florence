import Image from "next/image";
import { config } from "@/content/medicina";
import { Formulario } from "@/components/formulario";

export function Hero() {
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
          src="/images/hero.jpg"
          alt="Estudante de Medicina da Florence"
          fill
          className="object-cover object-[60%_25%] lg:object-[55%_center]"
          priority
        />

        {/* Desktop: gradiente horizontal — escuro à esquerda, revela a pessoa no centro/direita */}
        <div className="hidden lg:block absolute inset-0
          bg-gradient-to-r from-[#001a2e]/95 via-[#001a2e]/35 to-transparent" />

        {/* Mobile: gradiente mais suave — texto fica legível mas a pessoa aparece muito mais */}
        <div className="lg:hidden absolute inset-0
          bg-gradient-to-b from-[#001a2e]/78 via-[#001a2e]/20 to-[#001a2e]/45" />

        {/* Camada de contraste base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001a2e]/15 via-transparent to-[#001a2e]/25" />
      </div>

      {/* ── Conteúdo ───────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-16 lg:py-20">

        {/* Logo */}
        <div className="mb-12 lg:mb-14">
          <Image src="/logo.svg" alt="Centro Universitário Florence" width={260} height={56} className="brightness-0 invert opacity-90" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* ── Esquerda (7/12) ────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="eyebrow eyebrow-dark mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
              Medicina · São Luís, MA
            </div>

            <h1 className="headline-xl text-4xl md:text-5xl lg:text-[3.75rem] text-white mb-6
              [text-shadow:_0_2px_32px_rgba(0,26,46,0.5)]">
              {h.headline}
            </h1>

            <p className="text-white/75 text-lg leading-relaxed max-w-md mb-10
              [text-shadow:_0_1px_16px_rgba(0,26,46,0.4)]">
              {h.subheadline}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-10">
              {[
                { value: "6 anos", label: "Duração" },
                { value: "Integral", label: "Turno" },
                { value: "Médicos", label: "Professores" },
              ].map((s, i) => (
                <div key={s.label}>
                  {i > 0 && <div className="w-px h-10 bg-white/15 -ml-8 mr-0 absolute hidden" />}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-display font-800 text-2xl text-[#F5C842]">{s.value}</span>
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
              {["Vestibular Digital", "Nota do ENEM", "FIES · ProUni", "Bolsas até 60%"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-xs font-display font-600 tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Direita — Formulário (5/12) ────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <Formulario variant="sidebar" />
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
