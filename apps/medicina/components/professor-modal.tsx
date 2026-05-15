"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Professor {
  nome: string;
  cargo: string;
  bio: string;
  foto: string;
  formacao?: readonly string[];
  atuacao?: readonly string[];
}

interface ProfessorModalProps {
  professor: Professor | null;
  onClose: () => void;
}

export function ProfessorModal({ professor, onClose }: ProfessorModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!professor) return;
    setImgError(false);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [professor, onClose]);

  if (!professor) return null;

  const initials = professor.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001a2e]/70 backdrop-blur-md
        animate-[fadeIn_0.3s_cubic-bezier(0.32,0.72,0,1)_forwards]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="professor-modal-title"
    >
      <div
        className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[92dvh] overflow-hidden
          shadow-[0_32px_96px_rgba(0,26,46,0.4)]
          animate-[fadeUp_0.4s_cubic-bezier(0.32,0.72,0,1)_forwards]
          flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white
            border border-gray-200 flex items-center justify-center transition-all duration-300
            hover:scale-105 shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ── Coluna foto (esquerda no desktop, topo no mobile) ─── */}
        <div className="relative flex-shrink-0
          h-64 sm:h-80 md:h-auto md:w-2/5
          bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20 overflow-hidden">
          {!imgError ? (
            <Image
              src={professor.foto}
              alt={professor.nome}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-[center_20%] md:object-[center_30%]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-800 text-7xl text-[#0096d2]/40">
                {initials}
              </span>
            </div>
          )}
          {/* Gradiente sutil só no mobile (transição pra info abaixo) */}
          <div className="md:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        {/* ── Coluna conteúdo (direita no desktop, abaixo no mobile) ── */}
        <div className="flex-1 overflow-y-auto p-7 md:p-8">
          <p className="text-[11px] font-display font-700 text-[#005a82] uppercase tracking-[0.18em] mb-2">
            {professor.cargo}
          </p>
          <h2
            id="professor-modal-title"
            className="font-display font-800 text-[#001a2e] text-2xl md:text-3xl leading-tight mb-4 tracking-tight"
          >
            {professor.nome}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-7 text-sm md:text-base">{professor.bio}</p>

          {professor.formacao && professor.formacao.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0096d2] rounded-full" />
                Formação
              </h3>
              <ul className="space-y-2">
                {professor.formacao.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0096d2]/50 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {professor.atuacao && professor.atuacao.length > 0 && (
            <div>
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F5C842] rounded-full" />
                Atuação
              </h3>
              <ul className="space-y-2">
                {professor.atuacao.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#F5C842] mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
