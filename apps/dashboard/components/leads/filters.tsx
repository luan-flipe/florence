"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { STAGES } from "@/lib/stages";

export function LeadsFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (search) next.set("q", search);
      else next.delete("q");
      router.push(`?${next.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.push(`?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Buscar por nome ou e-mail"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />

      <select className="border rounded-md px-3 py-2 text-sm bg-white"
        value={params.get("period") ?? "30d"}
        onChange={(e) => setParam("period", e.target.value)}>
        <option value="today">Hoje</option>
        <option value="7d">7 dias</option>
        <option value="30d">30 dias</option>
        <option value="all">Tudo</option>
      </select>

      <select className="border rounded-md px-3 py-2 text-sm bg-white"
        value={params.get("status") ?? "active"}
        onChange={(e) => setParam("status", e.target.value)}>
        <option value="active">Ativos (sem perdidos)</option>
        <option value="all">Todos</option>
        {STAGES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
