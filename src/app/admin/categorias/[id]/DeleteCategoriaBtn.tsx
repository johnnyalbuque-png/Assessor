"use client";
import { useRouter } from "next/navigation";

export default function DeleteCategoriaBtn({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Deseja remover esta categoria? Só é possível excluir categorias sem fornecedores.")) return;
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/categorias");
      router.refresh();
    } else {
      alert("Não foi possível excluir. Remova os fornecedores desta categoria primeiro.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs transition-colors"
    >
      Excluir
    </button>
  );
}
