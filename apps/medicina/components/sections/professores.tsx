"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { config } from "@/content/medicina";
import { ProfessorCard } from "@/components/professor-card";

export function Professores() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, subtitulo, cards } = config.professores;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header split */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="reveal">
            <div className="eyebrow mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />
              Corpo docente
            </div>
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">
              {titulo}
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm lg:text-right leading-relaxed reveal reveal-delay-1">
            {subtitulo}
          </p>
        </div>

        {/* Grid de professores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((prof, i) => (
            <div key={prof.nome} className={`reveal reveal-delay-${(i % 4) + 1}`}>
              <ProfessorCard {...prof} />
            </div>
          ))}
        </div>

        {/* Nota sobre fotos */}
        <p className="text-center text-gray-300 text-xs mt-10 reveal">
          Fotos dos professores em breve — em atualização pelo cliente.
        </p>
      </div>
    </section>
  );
}
