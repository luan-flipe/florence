"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Depoimentos() {
  const ref = useScrollReveal<HTMLElement>();
  const d = config.depoimentos;
  if (!d.ativo) return null; // oculto ate conteudo real

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] mb-12 reveal">{d.titulo}</h2>
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
