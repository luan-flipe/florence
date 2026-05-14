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
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Foto */}
      <div className="relative h-56 bg-gradient-to-br from-blue-100 to-blue-200">
        {!imgError ? (
          <Image
            src={foto}
            alt={nome}
            fill
            className="object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-blue-400">{initials}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
          {cargo}
        </p>
        <h3 className="font-bold text-gray-900 mb-2">{nome}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
