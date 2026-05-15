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
      className="group text-left rounded-[1.5rem] overflow-hidden bg-white border border-gray-100/80
        transition-all duration-600 ease-spring hover:-translate-y-1.5
        hover:shadow-[0_20px_60px_rgba(0,80,140,0.12)] h-full flex flex-col
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0096d2] focus-visible:ring-offset-2"
    >
      {/* Foto */}
      <div className="relative h-56 bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image
            src={foto}
            alt={nome}
            fill
            className="object-cover object-top transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-5xl text-[#0096d2]/40">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent" />

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
      <div className="p-5 pt-4 flex flex-col flex-1">
        <p className="text-[10px] font-display font-700 text-[#0096d2] uppercase tracking-[0.15em] mb-1.5">
          {cargo}
        </p>
        <h3 className="font-display font-700 text-[#001a2e] text-base mb-2 leading-snug">
          {nome}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">
          {bio}
        </p>

        {/* "Ver perfil completo" no rodapé */}
        <span className="mt-auto pt-3 border-t border-gray-100 text-[11px] font-display font-700
          text-[#0096d2] uppercase tracking-widest flex items-center gap-1.5
          group-hover:gap-2.5 transition-all duration-300">
          Ver perfil completo
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      {/* Barra decorativa */}
      <div className="h-0.5 bg-gradient-to-r from-[#0096d2] to-[#00508c] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </button>
  );
}
