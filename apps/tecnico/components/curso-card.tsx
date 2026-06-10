"use client";
import Image from "next/image";
import { useState } from "react";

interface CursoCardProps {
  nome: string;
  modalidade: string;
  duracao: string;
  resumo: string;
  foto: string;
  onClick?: () => void;
}

export function CursoCard({ nome, modalidade, duracao, resumo, foto, onClick }: CursoCardProps) {
  const [imgError, setImgError] = useState(false);
  const initials = nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver detalhes de ${nome}`}
      className="group text-left rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#f6fafd]
        border border-[#e5eef5] shadow-[0_4px_18px_rgba(0,80,140,0.05)]
        transition-all duration-600 ease-spring hover:-translate-y-1
        hover:shadow-[0_20px_48px_rgba(0,80,140,0.13)] hover:border-[#0096d2]/25
        h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0096d2] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image src={foto} alt={nome} fill sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-4xl text-[#0096d2]/40">{initials}</span>
          </div>
        )}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 border border-gray-200 text-[10px] font-display font-700 text-[#005a82] uppercase tracking-wide">
          {modalidade}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-700 text-[#001a2e] text-base leading-snug">{nome}</h3>
        <p className="text-[11px] font-display font-600 text-[#0096d2] mt-0.5">{duracao}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{resumo}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-display font-700 text-[#005a82]">
          Ver detalhes
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#0096d2] via-[#00508c] to-[#F5C842] opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
    </button>
  );
}
