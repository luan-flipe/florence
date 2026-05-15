"use client";
import { useState, useEffect } from "react";
import { KanbanSquare, List } from "lucide-react";

const KEY = "leads_view";

export function ViewToggle({ children: [kanban, list] }: { children: [React.ReactNode, React.ReactNode] }) {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as "kanban" | "list" | null;
    if (saved) setView(saved);
  }, []);

  function set(v: "kanban" | "list") {
    setView(v);
    localStorage.setItem(KEY, v);
  }

  return (
    <>
      <div className="inline-flex border rounded-md overflow-hidden bg-white">
        <button onClick={() => set("kanban")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${view === "kanban" ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}>
          <KanbanSquare size={16} /> Kanban
        </button>
        <button onClick={() => set("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${view === "list" ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}>
          <List size={16} /> Lista
        </button>
      </div>
      <div className="mt-4">{view === "kanban" ? kanban : list}</div>
    </>
  );
}
