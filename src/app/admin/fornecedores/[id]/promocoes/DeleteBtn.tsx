"use client";
import { useRouter } from "next/navigation";

export default function DeleteBtn({ id }: { id: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Excluir esta promoção?")) return;
    await fetch(`/api/admin/promocoes/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-xs transition-colors shrink-0">
      Excluir
    </button>
  );
}
