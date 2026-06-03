"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Ingresso() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, subtitulo, formas } = config.ingresso;
  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />Ingresso</div>
          <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] reveal reveal-delay-1">{titulo}</h2>
          <p className="text-gray-500 mt-4 reveal reveal-delay-2">{subtitulo}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          {formas.map((f, i) => (
            <div key={f.nome} className={`flex gap-4 reveal reveal-delay-${(i % 3) + 1}`}>
              <span className="flex-shrink-0 font-display font-800 text-2xl text-[#0096d2]/30">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display font-700 text-[#001a2e]">{f.nome}</h3>
                <p className="text-gray-600 text-sm mt-1">{f.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
