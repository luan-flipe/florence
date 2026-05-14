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
          <div className="eyebrow mb-5 w-fit reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />
            Infraestrutura
          </div>
          <div className="flex items-start gap-4 reveal reveal-delay-1">
            <FlorenceIcon size={48} className="flex-shrink-0 mt-1" />
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">
              A estrutura é tão real<br />quanto a prática.
            </h2>
          </div>
        </div>

        {/*
          Masonry desktop 3-col:
          [cirurgia (tall)] [uti]      [simulacao]
          [cirurgia       ] [anatomia (wide+tall)        ]
          [leito           ] [anatomia                    ]
        */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px] lg:auto-rows-[220px]">
          {itens.map((item, i) => (
            <div
              key={item.label}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-3xl
                ${i === 0 ? "col-span-2 lg:col-span-1 row-span-2" : ""}
                ${i === 3 ? "lg:col-span-2 lg:row-span-2" : ""}
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
