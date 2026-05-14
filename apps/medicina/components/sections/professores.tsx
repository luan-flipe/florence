"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FlorenceIcon } from "@/components/florence-icon";
import { config } from "@/content/medicina";
import { ProfessorCard } from "@/components/professor-card";

export function Professores() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, subtitulo, cards } = config.professores;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="reveal">
            <div className="flex items-center gap-2 mb-4">
              <FlorenceIcon size={22} />
              <span className="eyebrow">Corpo docente</span>
            </div>
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">
              Conheça quem<br />vai te formar.
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm lg:text-right leading-relaxed reveal reveal-delay-1">
            {subtitulo}
          </p>
        </div>

        {/* Grid com altura igual entre cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {cards.map((prof, i) => (
            <div key={prof.nome} className={`reveal reveal-delay-${(i % 4) + 1} flex flex-col`}>
              <ProfessorCard {...prof} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
