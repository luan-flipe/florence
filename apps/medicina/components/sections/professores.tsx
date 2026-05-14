import Image from "next/image";
import { config } from "@/content/medicina";

export function Professores() {
  const { titulo, subtitulo, cards } = config.professores;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {titulo}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{subtitulo}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((prof) => (
            <div
              key={prof.nome}
              className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Foto */}
              <div className="relative h-56 bg-blue-50">
                <Image
                  src={prof.foto}
                  alt={prof.nome}
                  fill
                  className="object-cover object-top"
                  onError={() => {}} // placeholder fallback via CSS
                />
                {/* Fallback caso a foto não exista ainda */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 opacity-0 group-[.no-img]:opacity-100">
                  <span className="text-4xl font-bold text-blue-400">
                    {prof.nome
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                  {prof.cargo}
                </p>
                <h3 className="font-bold text-gray-900 mb-2">{prof.nome}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{prof.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
