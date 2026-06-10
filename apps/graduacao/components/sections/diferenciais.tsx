"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { FlorenceIcon } from "@florence/ui/florence-icon";
import { config } from "@/content/graduacao";

export function Diferenciais() {
  const ref = useScrollReveal<HTMLElement>();
  const d = config.diferenciais;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#001a2e] text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Bloco-lider */}
          <div className="reveal">
            <div className="eyebrow eyebrow-dark mb-5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]" />{d.titulo}</div>
            <div className="flex items-end gap-4 lg:gap-5 mb-5">
              <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0" />
              <h2 className="headline-lg text-3xl lg:text-5xl text-white">{d.lead.titulo}</h2>
            </div>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">{d.lead.corpo}</p>
          </div>
          {/* Pontos de apoio — divididos por linha, sem cards */}
          <div className="divide-y divide-white/10">
            {d.pontos.map((p, i) => (
              <div key={p.titulo} className={`py-6 first:pt-0 reveal reveal-delay-${i + 1}`}>
                <h3 className="font-display font-700 text-xl text-[#F5C842] mb-2">{p.titulo}</h3>
                <p className="text-white/70 leading-relaxed">{p.corpo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
