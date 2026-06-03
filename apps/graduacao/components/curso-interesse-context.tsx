"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface Ctx {
  curso: string;
  setCurso: (c: string) => void;
  pickAndScroll: (c: string) => void;
}

const CursoInteresseContext = createContext<Ctx | null>(null);

export function CursoInteresseProvider({ children }: { children: React.ReactNode }) {
  const [curso, setCurso] = useState("");

  const pickAndScroll = useCallback((c: string) => {
    setCurso(c);
    const el = document.getElementById("lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <CursoInteresseContext.Provider value={{ curso, setCurso, pickAndScroll }}>
      {children}
    </CursoInteresseContext.Provider>
  );
}

export function useCursoInteresse() {
  const ctx = useContext(CursoInteresseContext);
  if (!ctx) throw new Error("useCursoInteresse fora do provider");
  return ctx;
}
