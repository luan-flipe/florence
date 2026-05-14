import { config } from "@/content/medicina";
import { ProfessorCard } from "@/components/professor-card";

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
            <ProfessorCard key={prof.nome} {...prof} />
          ))}
        </div>
      </div>
    </section>
  );
}
