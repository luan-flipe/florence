"use client";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FlorenceIcon } from "@/components/florence-icon";
import { config } from "@/content/medicina";

export function Estrutura() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, itens } = config.estrutura;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-sky-pale overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4 reveal">
            <FlorenceIcon size={22} />
            <span className="eyebrow">Infraestrutura</span>
          </div>
          <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] reveal reveal-delay-1">
            A estrutura é tão real<br />quanto a prática.
          </h2>
        </div>

        {/*
          Layout 3 colunas desktop, 5 itens:
          Col 1: cirurgia (row-span-2 = 2 linhas)
          Col 2: uti (linha 1) + anatomia (linha 2, row-span-2 para preencher)
          Col 3: simulacao (linha 1) + leito (linha 2)
          Resultado: sem buracos
        */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ gridTemplateRows: "220px 220px" }}>

          {itens.map((item, i) => (
            <div
              key={item.label}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-3xl
                ${i === 0 ? "row-span-2" : ""}
                ${i === 3 ? "row-span-2" : ""}
              `}
            >
              <Image
                src={item.foto}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-800 ease-spring group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a2e]/80 via-[#001a2e]/20 to-transparent
                transition-opacity duration-400 group-hover:opacity-75" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs font-display font-700 text-white uppercase tracking-[0.15em]">
                  {item.label}
                </span>
              </div>

              <div className="absolute inset-0 rounded-3xl border-2 border-[#0096d2]/0
                transition-all duration-400 group-hover:border-[#0096d2]/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
