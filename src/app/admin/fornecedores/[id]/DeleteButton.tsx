"use client";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Deseja remover este fornecedor?")) return;
    await fetch(`/api/admin/fornecedores/${id}`, { method: "DELETE" });
    router.push("/admin/fornecedores");
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm transition-colors">
      Excluir
    </button>
  );
}
