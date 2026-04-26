"use client";
import { useRouter } from "next/navigation";

export default function DeleteBannerBtn({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Excluir este banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm transition-colors">
      Excluir
    </button>
  );
}
