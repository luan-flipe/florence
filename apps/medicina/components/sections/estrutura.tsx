"use client";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { config } from "@/content/medicina";

export function Estrutura() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, itens } = config.estrutura;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <div className="eyebrow mb-4 w-fit reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />
            Infraestrutura
          </div>
          <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] reveal reveal-delay-1">
            {titulo}
          </h2>
        </div>

        {/* Grid de fotos estilo masonry */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px] lg:auto-rows-[220px]">
          {itens.map((item, i) => (
            <div
              key={item.label}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative overflow-hidden rounded-3xl
                ${i === 0 ? "col-span-2 lg:col-span-1 row-span-2" : ""}
                ${i === 3 ? "lg:col-span-2" : ""}
              `}
            >
              {/* Foto */}
              <Image
                src={item.foto}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-800 ease-spring group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a2e]/80 via-[#001a2e]/20 to-transparent
                transition-opacity duration-400 group-hover:opacity-80" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs font-display font-700 text-white uppercase tracking-[0.15em]">
                  {item.label}
                </span>
              </div>

              {/* Borda decorativa ao hover */}
              <div className="absolute inset-0 rounded-3xl border-2 border-[#0096d2]/0
                transition-all duration-400 group-hover:border-[#0096d2]/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
