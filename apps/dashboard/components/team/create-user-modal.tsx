"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { UserRole } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function CreateUserModal({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      email: form.get("email"),
      name: form.get("name"),
      role: form.get("role"),
      courses: form.get("courses")?.toString().split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      const msg = typeof err.error === "string" ? err.error : "Erro ao criar usuário";
      setError(msg);
      return;
    }
    toast.success("Usuário criado e e-mail enviado");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
        <Plus size={16} /> Adicionar usuário
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select id="role" name="role" className="w-full border rounded-md px-3 py-2 text-sm bg-white" required>
              {allowedRoles.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="courses">Cursos (separados por vírgula)</Label>
            <Input id="courses" name="courses" placeholder="medicina, enfermagem" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar e enviar e-mail"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
