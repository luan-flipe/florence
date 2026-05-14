"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { config } from "@/content/medicina";
import { FlorenceIcon } from "@/components/florence-icon";

const icons = {
  stethoscope: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  flask: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31"/>
      <path d="M14 9.3V1.99"/>
      <path d="M8.5 2h7"/>
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0"/>
      <path d="M5.58 16.5h12.85"/>
    </svg>
  ),
  building: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/><path d="M10 10h4"/>
      <path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  ),
  award: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
};

const cardStyles = [
  { bg: "bg-[#0096d2]", iconBg: "bg-white/15", iconColor: "text-white", textColor: "text-white", subColor: "text-white/75" },
  { bg: "bg-white border border-gray-100", iconBg: "bg-sky-pale", iconColor: "text-[#0096d2]", textColor: "text-[#001a2e]", subColor: "text-gray-500" },
  { bg: "bg-[#001a2e]", iconBg: "bg-white/10", iconColor: "text-[#F5C842]", textColor: "text-white", subColor: "text-white/60" },
  { bg: "bg-white border border-gray-100", iconBg: "bg-[#001a2e]/8", iconColor: "text-[#00508c]", textColor: "text-[#001a2e]", subColor: "text-gray-500" },
];

export function Diferenciais() {
  const ref = useScrollReveal<HTMLElement>();
  const items = config.diferenciais;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="eyebrow mb-5 reveal w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />
            Diferenciais
          </div>
          <div className="flex items-stretch gap-5 reveal reveal-delay-1">
            <FlorenceIcon className="h-[4.25rem] lg:h-[6.75rem] w-auto flex-shrink-0 self-stretch" />
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e]">
              Por que Medicina<br />na Florence.
            </h2>
          </div>
        </div>

        {/* Grid assimétrico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {items.map((item, i) => {
            const style = cardStyles[i % cardStyles.length];
            const IconEl = icons[item.icon as keyof typeof icons] ?? icons.stethoscope;

            return (
              <div
                key={item.title}
                className={`reveal reveal-delay-${i + 1} rounded-4xl p-7 flex flex-col gap-6
                  transition-all duration-600 ease-spring hover:-translate-y-1
                  hover:shadow-[0_16px_48px_rgba(0,26,46,0.12)] ${style.bg}`}
              >
                {/* Ícone maior — centralizado de verdade */}
                <div className={`w-16 h-16 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center flex-shrink-0`}>
                  {IconEl}
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className={`font-display font-700 text-lg mb-2 ${style.textColor}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${style.subColor}`}>
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
