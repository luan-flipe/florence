"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface Curso {
  slug: string; nome: string; area: string; titulacao: string;
  duracao: string; turnos: readonly string[]; modalidade: string;
  resumo: string; descricao: string;
  diferenciais: readonly string[]; mercado: readonly string[]; foto: string;
}

interface CursoModalProps {
  curso: Curso | null;
  onClose: () => void;
  onQuero: (nome: string) => void; // pre-seleciona no form + scroll
}

export function CursoModal({ curso, onClose, onQuero }: CursoModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!curso) return;
    setImgError(false);
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [curso, onClose]);

  if (!curso) return null;
  const initials = curso.nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001a2e]/70 backdrop-blur-md animate-[fadeIn_0.3s_cubic-bezier(0.32,0.72,0,1)_forwards]"
      onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="curso-modal-title">
      <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[92dvh] overflow-hidden shadow-[0_32px_96px_rgba(0,26,46,0.4)] animate-[fadeUp_0.4s_cubic-bezier(0.32,0.72,0,1)_forwards] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fechar"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <div className="relative flex-shrink-0 h-56 sm:h-72 md:h-auto md:w-2/5 bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20 overflow-hidden">
          {!imgError ? (
            <Image src={curso.foto} alt={curso.nome} fill sizes="(min-width:768px) 40vw, 100vw"
              className="object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-800 text-7xl text-[#0096d2]/40">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-7 md:p-8">
          <p className="text-[11px] font-display font-700 text-[#005a82] uppercase tracking-[0.18em] mb-2">{curso.area}</p>
          <h2 id="curso-modal-title" className="font-display font-800 text-[#001a2e] text-2xl md:text-3xl leading-tight mb-3 tracking-tight">{curso.nome}</h2>

          <div className="flex flex-wrap gap-2 mb-5">
            {[curso.titulacao, curso.duracao, curso.modalidade, ...curso.turnos].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-[#0096d2]/10 text-[#005a82] text-xs font-display font-600">{t}</span>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">{curso.descricao}</p>

          {curso.diferenciais.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-[#0096d2] rounded-full" />Diferenciais</h3>
              <ul className="space-y-2">
                {curso.diferenciais.map((d) => (
                  <li key={d} className="flex gap-3 text-sm text-gray-700 leading-relaxed"><span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0096d2]/50 mt-2" /><span>{d}</span></li>
                ))}
              </ul>
            </div>
          )}

          {curso.mercado.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-[#F5C842] rounded-full" />Mercado de trabalho</h3>
              <div className="flex flex-wrap gap-2">
                {curso.mercado.map((m) => (
                  <span key={m} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-display font-600">{m}</span>
                ))}
              </div>
            </div>
          )}

          <button type="button" onClick={() => onQuero(curso.nome)}
            className="btn-primary w-full justify-center">
            <span>Quero esse curso</span>
            <span className="btn-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
          </button>
        </div>
      </div>
    </div>
  );
}
