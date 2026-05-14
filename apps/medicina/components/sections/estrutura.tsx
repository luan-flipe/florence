import Image from "next/image";
import { config } from "@/content/medicina";

export function Estrutura() {
  const { titulo, itens } = config.estrutura;

  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          {titulo}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {itens.map((item, i) => (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-2xl bg-gray-800 ${
                i === 0 ? "col-span-2 md:col-span-1 row-span-2" : ""
              }`}
              style={{ minHeight: i === 0 ? "320px" : "160px" }}
            >
              <Image
                src={item.foto}
                alt={item.label}
                fill
                className="object-cover opacity-70 hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-4 text-sm font-medium text-white/90">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
