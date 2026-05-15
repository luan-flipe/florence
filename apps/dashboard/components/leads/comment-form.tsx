"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";

export function CommentForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("comments").insert({
      lead_id: leadId,
      user_id: user.id,
      text: text.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Erro ao comentar", { description: error.message });
      return;
    }
    setText("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 mt-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar comentário..."
        className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Enviando..." : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
