import Image from "next/image";
import { config } from "@/content/medicina";
import { Formulario } from "@/components/formulario";

export function Hero() {
  const h = config.hero;

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      {/* Background overlay com foto (quando disponível) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Estudantes de Medicina da Florence"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Texto */}
          <div className="flex flex-col justify-center pt-4 lg:pt-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full w-fit mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Centro Universitário Florence — São Luís, MA
            </span>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              {h.headline}
            </h1>

            <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-lg">
              {h.subheadline}
            </p>

            {/* Social proof rápida */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div>
                <p className="text-2xl font-bold">Nota MEC</p>
                <p className="text-white/60 text-sm">Qualidade reconhecida</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold">1º período</p>
                <p className="text-white/60 text-sm">Prática desde o início</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold">Médicos</p>
                <p className="text-white/60 text-sm">Como professores</p>
              </div>
            </div>
          </div>

          {/* Formulário sticky */}
          <div className="lg:sticky lg:top-8">
            <Formulario variant="sidebar" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 text-white/40 text-xs">
        <span>Saiba mais</span>
        <div className="w-px h-8 bg-white/20" />
      </div>
    </section>
  );
}
