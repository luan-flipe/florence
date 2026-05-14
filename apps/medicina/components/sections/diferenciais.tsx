import { Stethoscope, FlaskConical, Building2, Award } from "lucide-react";
import { config } from "@/content/medicina";

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="w-6 h-6" />,
  flask: <FlaskConical className="w-6 h-6" />,
  building: <Building2 className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
};

export function Diferenciais() {
  const items = config.diferenciais;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
          Por que Medicina na Florence.
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Quatro razões que fazem a diferença antes mesmo de você entrar na
          faculdade.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                {iconMap[item.icon] ?? <Stethoscope className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
