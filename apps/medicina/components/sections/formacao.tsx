import { config } from "@/content/medicina";

export function Formacao() {
  const { titulo, fases } = config.formacao;

  return (
    <section className="py-20 bg-blue-950 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          {titulo}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {fases.map((fase, i) => (
            <div
              key={fase.nome}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              {/* Número da fase */}
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-lg mb-4">
                {i + 1}
              </div>

              <p className="text-blue-300 text-xs font-medium uppercase tracking-widest mb-1">
                {fase.periodo}
              </p>
              <h3 className="text-white font-bold text-lg mb-3">{fase.nome}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {fase.descricao}
              </p>

              {/* Conector entre cards (desktop) */}
              {i < fases.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 text-xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
