"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { FlorenceIcon } from "@florence/ui/florence-icon";
import type { UmbrellaConfig } from "../types";

interface DepoimentosProps {
  depoimentos: UmbrellaConfig["depoimentos"];
}

export function Depoimentos({ depoimentos }: DepoimentosProps) {
  const ref = useScrollReveal<HTMLElement>();
  const d = depoimentos;
  if (!d.ativo) return null; // oculto ate conteudo real

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end gap-4 lg:gap-5 mb-12 reveal">
          <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
          <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] whitespace-pre-line">{d.titulo}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {d.cards.map((c, i) => (
            <figure key={i} className={`bg-white rounded-2xl p-7 border border-[#e5eef5] reveal reveal-delay-${i + 1}`}>
              <blockquote className="text-gray-700 leading-relaxed">{c.texto}</blockquote>
              <figcaption className="mt-4 font-display font-700 text-[#001a2e]">{c.nome}<span className="block text-xs font-600 text-gray-500">{c.turma}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
