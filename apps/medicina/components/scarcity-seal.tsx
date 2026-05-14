// Selo redondo de escassez — estilo carimbo de oferta
// Borda totalmente dentada (gerada via SVG path com 24 dentes)

interface ScarcitySealProps {
  className?: string;
}

// Gera o path SVG de um círculo serrilhado
function makeSerratedPath(teeth = 24, outerR = 48, innerR = 44, cx = 50, cy = 50) {
  const total = teeth * 2;
  const pts: string[] = [];
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")} Z`;
}

export function ScarcitySeal({ className = "" }: ScarcitySealProps) {
  const path = makeSerratedPath(24, 48, 44, 50, 50);

  return (
    <div className={`absolute -top-10 -right-8 lg:-top-12 lg:-right-10 z-20 ${className}`}>
      {/* Wrapper para rotacionar */}
      <div className="rotate-[-10deg]
        drop-shadow-[0_12px_28px_rgba(245,200,66,0.45)]">

        {/* Wrapper interno para a animação float (não conflita com a rotação) */}
        <div className="relative w-32 h-32 lg:w-40 lg:h-40
          animate-[float_4s_cubic-bezier(0.45,0,0.55,1)_infinite]">

          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="sealGradient" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FCE695" />
                <stop offset="50%" stopColor="#F5C842" />
                <stop offset="100%" stopColor="#C9A012" />
              </radialGradient>
            </defs>

            {/* Forma dentada (carimbo) */}
            <path d={path} fill="url(#sealGradient)" />

            {/* Anel interno decorativo (linha pontilhada efeito carimbo) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#001a2e"
              strokeOpacity="0.25"
              strokeWidth="0.6"
              strokeDasharray="0.8 1.2"
            />
          </svg>

          {/* Conteúdo de texto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
            <span className="text-[9px] lg:text-[10px] font-display font-700 uppercase tracking-[0.2em] text-[#001a2e] leading-none">
              Inscrições
            </span>
            <span className="text-[9px] lg:text-[10px] font-display font-700 uppercase tracking-[0.2em] text-[#001a2e]/80 leading-none mt-0.5">
              até
            </span>
            <span className="font-display font-800 text-[#001a2e] leading-none mt-1.5
              text-3xl lg:text-[2.5rem]">
              25
            </span>
            <span className="text-[10px] lg:text-[11px] font-display font-800 uppercase tracking-[0.18em] text-[#001a2e] leading-none mt-1.5">
              de maio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
