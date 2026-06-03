"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config, cursoOptions } from "@/content/graduacao";
import { Formulario } from "@florence/ui/formulario";
import { useCursoInteresse } from "@/components/curso-interesse-context";
import type { UtmParams } from "@/app/page";

export function CtaFinal({ utm }: { utm?: UtmParams }) {
  const ref = useScrollReveal<HTMLElement>();
  const cta = config.ctaFinal;
  const { curso, setCurso } = useCursoInteresse();

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#00508c] to-[#0096d2]" />
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="headline-lg text-3xl lg:text-5xl text-white mb-4 reveal text-balance">{cta.headline}</h2>
          <p className="text-white/70 text-lg reveal reveal-delay-1">{cta.microcopy}</p>
        </div>
        <div className="max-w-md mx-auto reveal reveal-delay-2">
          <Formulario
            copy={config.formulario}
            variant="inline"
            utm={utm}
            formId="form-cta-final"
            formName="form-cta-final"
            extraFields={[{ name: "curso_interesse", label: config.formulario.cursoLabel, type: "select", options: cursoOptions, required: true, placeholder: config.formulario.cursoPlaceholder }]}
            extraValues={{ curso_interesse: curso }}
            onExtraChange={(_, v) => setCurso(v)}
          />
        </div>
      </div>
    </section>
  );
}
