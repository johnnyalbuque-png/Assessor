"use client";
import { useRouter } from "next/navigation";

export default function AprovarBtn({ id }: { id: string }) {
  const router = useRouter();

  async function update(status: string) {
    await fetch(`/api/admin/solicitacoes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => update("APROVADO")} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
        Aprovar
      </button>
      <button onClick={() => update("REJEITADO")} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
        Rejeitar
      </button>
    </div>
  );
}
