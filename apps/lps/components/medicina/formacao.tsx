"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { FlorenceIcon } from "@florence/ui/florence-icon";
import { config } from "@/content/medicina";

export function Formacao() {
  const ref = useScrollReveal<HTMLElement>();
  const { fases } = config.formacao;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#001a2e] overflow-hidden relative">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 opacity-10"
        style={{ background: "radial-gradient(circle, #0096d2 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="eyebrow eyebrow-dark mb-5 w-fit reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]" />
            Estrutura curricular
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex items-end gap-5 reveal reveal-delay-1">
              <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
              <h2 className="headline-lg text-3xl lg:text-5xl text-white">
                Seis anos que constroem<br />um médico completo.
              </h2>
            </div>
            <p className="text-white/35 text-sm max-w-xs lg:text-right reveal reveal-delay-2 lg:pb-2">
              Bacharelado · 12 semestres<br />Turno integral · Presencial
            </p>
          </div>
        </div>

        {/* Cards com setas entre eles, centralizadas verticalmente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
          {fases.map((fase, i) => (
            <div
              key={fase.nome}
              className={`reveal reveal-delay-${i + 1} relative`}
            >
              <div className="card-shell h-full">
                <div className="card-core bg-white/5 p-6 h-full flex flex-col">
                  {/* Número */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#0096d2]/40 flex items-center justify-center">
                      <span className="font-display font-800 text-[#0096d2] text-lg leading-none">{i + 1}</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <p className="text-[#F5C842] text-xs font-display font-600 uppercase tracking-widest mb-2">
                    {fase.periodo}
                  </p>
                  <h3 className="font-display font-700 text-xl text-white mb-3">{fase.nome}</h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{fase.descricao}</p>
                </div>
              </div>

              {/* Seta entre cards — centralizada no gap (gap-10 = 40px, seta w-6 = 24px → -right-8 = -32px) */}
              {i < fases.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-8 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-[#0096d2]/15 border border-[#0096d2]/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0096d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
