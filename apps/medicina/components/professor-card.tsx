"use client";
import Image from "next/image";
import { useState } from "react";

interface ProfessorCardProps {
  nome: string;
  cargo: string;
  bio: string;
  foto: string;
}

export function ProfessorCard({ nome, cargo, bio, foto }: ProfessorCardProps) {
  const [imgError, setImgError] = useState(false);

  const initials = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="group rounded-[1.5rem] overflow-hidden bg-white border border-gray-100/80
      transition-all duration-600 ease-spring hover:-translate-y-1.5
      hover:shadow-[0_20px_60px_rgba(0,80,140,0.12)] h-full flex flex-col">

      {/* Foto — aspect-[4/5] portrait, espaço suficiente para enquadrar rostos */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image
            src={foto}
            alt={nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-[center_20%] transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-5xl text-[#0096d2]/40">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 pt-4 flex flex-col flex-1">
        {/* Cargo como eyebrow */}
        <p className="text-[10px] font-display font-700 text-[#0096d2] uppercase tracking-[0.15em] mb-1.5">
          {cargo}
        </p>
        <h3 className="font-display font-700 text-[#001a2e] text-base mb-2 leading-snug">
          {nome}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
          {bio}
        </p>
      </div>

      {/* Barra de cor decorativa na base */}
      <div className="h-0.5 bg-gradient-to-r from-[#0096d2] to-[#00508c] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </div>
  );
}
