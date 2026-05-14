"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { config } from "@/content/medicina";

export function Formacao() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, fases } = config.formacao;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#001a2e] overflow-hidden relative">

      {/* Detalhe decorativo */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 opacity-10"
        style={{ background: "radial-gradient(circle, #0096d2 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="eyebrow eyebrow-dark mb-4 w-fit reveal">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]" />
              Estrutura curricular
            </div>
            <h2 className="headline-lg text-3xl lg:text-5xl text-white reveal reveal-delay-1">
              {titulo}
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs lg:text-right reveal reveal-delay-2">
            Bacharelado · 12 semestres · Turno integral · Presencial
          </p>
        </div>

        {/* Cards das fases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

          {/* Linha conectora desktop */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#0096d2]/20 via-[#0096d2]/60 to-[#F5C842]/40 z-0" />

          {fases.map((fase, i) => (
            <div
              key={fase.nome}
              className={`reveal reveal-delay-${i + 1} relative z-10`}
            >
              {/* Shell externo */}
              <div className="card-shell">
                <div className="card-core bg-white/5 p-6">
                  {/* Número */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full border border-[#0096d2]/40 flex items-center justify-center">
                      <span className="font-display font-800 text-[#0096d2] text-lg leading-none">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Período */}
                  <p className="text-[#F5C842] text-xs font-display font-600 uppercase tracking-widest mb-2">
                    {fase.periodo}
                  </p>

                  {/* Nome */}
                  <h3 className="font-display font-700 text-xl text-white mb-3">
                    {fase.nome}
                  </h3>

                  {/* Descrição */}
                  <p className="text-white/50 text-sm leading-relaxed">
                    {fase.descricao}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
