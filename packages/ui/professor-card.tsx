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

export function ProfessorCard({ nome, cargo, foto, onClick }: ProfessorCardProps) {
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
      className="group text-left rounded-2xl overflow-hidden
        bg-gradient-to-b from-white to-[#f6fafd]
        border border-[#e5eef5]
        shadow-[0_4px_18px_rgba(0,80,140,0.05)]
        transition-all duration-600 ease-spring hover:-translate-y-1
        hover:shadow-[0_20px_48px_rgba(0,80,140,0.13)] hover:border-[#0096d2]/25
        h-full flex flex-col
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0096d2] focus-visible:ring-offset-2"
    >
      {/* Foto quadrada para compacto */}
      <div className="relative aspect-square bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image
            src={foto}
            alt={nome}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-[center_20%] transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-4xl text-[#0096d2]/40">
              {initials}
            </span>
          </div>
        )}

        {/* Indicador "ver mais" no hover */}
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 border border-gray-200
          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300
          translate-y-1 group-hover:translate-y-0 shadow-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0096d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Info compacta */}
      <div className="p-3.5 flex flex-col flex-1 min-h-[5.5rem]">
        <p className="text-[9px] font-display font-700 text-[#0096d2] uppercase tracking-[0.12em] mb-1 leading-snug line-clamp-2">
          {cargo}
        </p>
        <h3 className="font-display font-700 text-[#001a2e] text-sm leading-snug line-clamp-2">
          {nome}
        </h3>
      </div>

      {/* Barra de cor decorativa */}
      <div className="h-0.5 bg-gradient-to-r from-[#0096d2] via-[#00508c] to-[#F5C842]
        opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
    </button>
  );
}
