"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { config } from "@/content/medicina";
import { Formulario } from "@/components/formulario";
import type { UtmParams } from "@/app/page";

export function CtaFinal({ utm }: { utm?: UtmParams }) {
  const ref = useScrollReveal<HTMLElement>();
  const cta = config.ctaFinal;

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#00508c] to-[#0096d2]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 rounded-full"
          style={{ background: "radial-gradient(circle, #F5C842 0%, transparent 65%)" }} />
        <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] opacity-15 rounded-full"
          style={{ background: "radial-gradient(circle, #0096d2 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <div className="eyebrow eyebrow-dark mb-6 w-fit mx-auto reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]" />
            Garanta sua vaga
          </div>
          <h2 className="headline-lg text-3xl lg:text-5xl text-white mb-4 reveal reveal-delay-1 text-center text-balance">
            {cta.headline}
          </h2>
          <p className="text-white/70 text-lg reveal reveal-delay-2">
            {cta.subheadline}
          </p>
        </div>

        <div className="max-w-md mx-auto reveal reveal-delay-3">
          <Formulario copy={config.formulario} variant="inline" utm={utm} />
        </div>

        {/* Microcopy com contraste adequado */}
        <p className="text-center text-white/60 text-sm mt-5 reveal reveal-delay-4 font-display">
          {cta.microcopy}
        </p>
      </div>
    </section>
  );
}
