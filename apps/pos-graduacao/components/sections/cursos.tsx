"use client";
import { useState } from "react";
import { config } from "@/content/pos-graduacao";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { FlorenceIcon } from "@florence/ui/florence-icon";
import { CursoCard } from "@/components/curso-card";
import { CursoModal, type Curso } from "@/components/curso-modal";
import { useCursoInteresse } from "@/components/curso-interesse-context";

export function Cursos() {
  const ref = useScrollReveal<HTMLElement>();
  const { subtitulo, grupos } = config.cursos;
  const [selected, setSelected] = useState<Curso | null>(null);
  const { pickAndScroll } = useCursoInteresse();

  return (
    <>
      <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />Especializações</div>
            <div className="flex items-end gap-4 lg:gap-5 reveal reveal-delay-1">
              <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
              <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">Encontre sua<br />especialização.</h2>
            </div>
            <p className="text-gray-500 mt-4 reveal reveal-delay-2">{subtitulo}</p>
          </div>

          {grupos.map((grupo) => (
            <div key={grupo.area} className="mb-14 last:mb-0">
              <h3 className="font-display font-700 text-[#0096d2] text-sm uppercase tracking-[0.18em] mb-6 reveal">{grupo.area}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {grupo.itens.map((curso, i) => (
                  <div key={curso.slug} className={`reveal reveal-delay-${(i % 3) + 1}`}>
                    <CursoCard nome={curso.nome} modalidade={curso.modalidade} duracao={curso.duracao} resumo={curso.resumo} foto={curso.foto} onClick={() => setSelected(curso as unknown as Curso)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CursoModal curso={selected} onClose={() => setSelected(null)} onQuero={(nome) => { setSelected(null); pickAndScroll(nome); }} />
    </>
  );
}
