"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { FlorenceIcon } from "@florence/ui/florence-icon";
import type { UmbrellaConfig } from "../types";

interface FinanciamentoProps {
  financiamento: UmbrellaConfig["financiamento"];
}

export function Financiamento({ financiamento }: FinanciamentoProps) {
  const ref = useScrollReveal<HTMLElement>();
  const { eyebrow, titulo, descricao, itens } = financiamento;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />{eyebrow}</div>
          <div className="flex items-end gap-4 lg:gap-5 reveal reveal-delay-1">
            <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] whitespace-pre-line">{titulo}</h2>
          </div>
          <p className="text-gray-500 mt-4 reveal reveal-delay-2">{descricao}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itens.map((it, i) => (
            <div key={it.nome} className={`reveal reveal-delay-${(i % 4) + 1}`}>
              <h3 className="font-display font-800 text-[#0096d2] text-lg">{it.nome}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{it.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
