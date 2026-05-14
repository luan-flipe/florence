// Selo redondo de escassez — estilo "carimbo de oferta"
// Posicionado no canto superior direito do formulário

interface ScarcitySealProps {
  className?: string;
}

export function ScarcitySeal({ className = "" }: ScarcitySealProps) {
  return (
    <div className={`absolute -top-5 -right-5 z-20 ${className}`}>
      <div className="relative w-24 h-24 lg:w-[6.5rem] lg:h-[6.5rem]
        rotate-[-8deg]
        animate-[pulse_3.5s_cubic-bezier(0.4,0,0.6,1)_infinite]">

        {/* Aro externo dentado (efeito carimbo) */}
        <div className="absolute inset-0 rounded-full bg-[#F5C842]
          shadow-[0_8px_24px_rgba(245,200,66,0.45)]"
          style={{
            maskImage: "radial-gradient(circle, black 60%, transparent 62%)",
            WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 62%)",
          }}
        />

        {/* Círculo interno principal */}
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#F5C842] to-[#D4A017]
          border-2 border-[#fef3c7]/40
          flex flex-col items-center justify-center text-center">
          <span className="text-[8px] lg:text-[9px] font-display font-700 uppercase tracking-[0.15em] text-[#001a2e] leading-none">
            Inscrições até
          </span>
          <span className="font-display font-800 text-[#001a2e] leading-none mt-1
            text-xl lg:text-2xl">
            25
          </span>
          <span className="text-[10px] lg:text-[11px] font-display font-700 uppercase tracking-[0.15em] text-[#001a2e] leading-none mt-0.5">
            de maio
          </span>
        </div>
      </div>
    </div>
  );
}
