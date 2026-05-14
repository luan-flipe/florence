import { config } from "@/content/medicina";
import { Formulario } from "@/components/formulario";

export function CtaFinal() {
  const cta = config.ctaFinal;

  return (
    <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{cta.headline}</h2>
          <p className="text-white/70 text-lg">{cta.subheadline}</p>
        </div>

        <div className="max-w-md mx-auto">
          <Formulario variant="inline" />
          <p className="text-white/40 text-xs text-center mt-4">{cta.microcopy}</p>
        </div>
      </div>
    </section>
  );
}
