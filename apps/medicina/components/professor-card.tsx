"use client";
import Image from "next/image";
import { useState } from "react";

interface ProfessorCardProps {
  nome: string;
  cargo: string;
  bio: string;
  foto: string;
  onClick?: () => void;
}

export function ProfessorCard({ nome, cargo, bio, foto, onClick }: ProfessorCardProps) {
  const [imgError, setImgError] = useState(false);

  const initials = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver detalhes de ${nome}`}
      className="group text-left rounded-[1.5rem] overflow-hidden
        bg-gradient-to-b from-white to-[#f6fafd]
        border border-[#e5eef5]
        shadow-[0_4px_18px_rgba(0,80,140,0.05)]
        transition-all duration-600 ease-spring hover:-translate-y-1.5
        hover:shadow-[0_24px_60px_rgba(0,80,140,0.15)] hover:border-[#0096d2]/25
        h-full flex flex-col
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0096d2] focus-visible:ring-offset-2"
    >
      {/* Foto sem gradiente forçado embaixo */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image
            src={foto}
            alt={nome}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-[center_25%] transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-5xl text-[#0096d2]/40">
              {initials}
            </span>
          </div>
        )}

        {/* Cargo flutuante sobre a foto — sempre visível, dá identidade ao card */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block bg-white/95 backdrop-blur-sm
            text-[#005a82] text-[9px] font-display font-700 uppercase tracking-[0.15em]
            px-2.5 py-1 rounded-full shadow-sm border border-white/60">
            {cargo}
          </span>
        </div>

        {/* Indicador "ver mais" no hover */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 border border-gray-200
          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300
          translate-y-1 group-hover:translate-y-0 shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0096d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 pt-5 flex flex-col flex-1 relative">
        {/* Linha decorativa no topo — separador sutil */}
        <span className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#0096d2]/15 to-transparent" />

        <h3 className="font-display font-700 text-[#001a2e] text-lg mb-2 leading-snug tracking-tight">
          {nome}
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {bio}
        </p>

        {/* "Ver perfil completo" — sempre visível com cor da marca */}
        <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-display font-700
          text-[#0096d2] uppercase tracking-widest
          group-hover:gap-3 transition-all duration-300">
          Ver perfil completo
          <span className="inline-flex w-5 h-5 rounded-full bg-[#0096d2]/10 items-center justify-center
            group-hover:bg-[#0096d2] transition-colors duration-300">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="text-[#0096d2] group-hover:text-white transition-colors duration-300">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </span>
      </div>

      {/* Barra de cor decorativa na base — sempre 30%, 100% no hover */}
      <div className="h-1 bg-gradient-to-r from-[#0096d2] via-[#00508c] to-[#F5C842]
        opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
    </button>
  );
}
