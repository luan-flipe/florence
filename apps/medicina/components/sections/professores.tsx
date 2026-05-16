"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FlorenceIcon } from "@/components/florence-icon";
import { config } from "@/content/medicina";
import { ProfessorCard } from "@/components/professor-card";

// Modal carrega só na primeira abertura — sai do bundle inicial
const ProfessorModal = dynamic(
  () => import("@/components/professor-modal").then((m) => m.ProfessorModal),
  { ssr: false }
);

type Professor = (typeof config.professores.cards)[number];

export function Professores() {
  const ref = useScrollReveal<HTMLElement>();
  const { subtitulo, cards } = config.professores;
  const [selected, setSelected] = useState<Professor | null>(null);

  return (
    <>
      <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="mb-16">
            <div className="eyebrow mb-5 w-fit reveal">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />
              Corpo docente
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex items-end gap-5 reveal reveal-delay-1">
                <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
                <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">
                  Conheça quem<br />vai te formar.
                </h2>
              </div>
              <p className="text-gray-400 text-sm max-w-sm lg:text-right leading-relaxed reveal reveal-delay-2 lg:pb-2">
                {subtitulo}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch">
            {cards.map((prof, i) => (
              <div key={prof.nome} className={`reveal reveal-delay-${(i % 4) + 1} flex flex-col`}>
                <ProfessorCard
                  nome={prof.nome}
                  cargo={prof.cargo}
                  bio={prof.bio}
                  foto={prof.foto}
                  onClick={() => setSelected(prof)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProfessorModal professor={selected} onClose={() => setSelected(null)} />
    </>
  );
}
