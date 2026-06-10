"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config, cursoOptions } from "@/content/tecnico";
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

      {/* Glow amarelo (direita) + glow azul + textura listrada diagonal */}
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
