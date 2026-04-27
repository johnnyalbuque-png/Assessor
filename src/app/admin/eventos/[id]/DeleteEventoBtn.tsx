"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteEventoBtn({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/eventos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-2">
        <button onClick={handleDelete} className="text-red-600 hover:underline text-sm font-medium">Confirmar</button>
        <button onClick={() => setConfirm(false)} className="text-gray-400 hover:underline text-sm">Cancelar</button>
      </span>
    );
  }
  return (
    <button onClick={() => setConfirm(true)} className="text-red-400 hover:text-red-600 text-sm transition-colors">
      Excluir
    </button>
  );
}
