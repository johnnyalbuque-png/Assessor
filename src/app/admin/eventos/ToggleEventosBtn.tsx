"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleEventosBtn({ ativo }: { ativo: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/config-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventos_ativo: ativo ? "0" : "1" }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
        ativo
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${ativo ? "bg-green-500" : "bg-gray-400"}`} />
      Página: {ativo ? "Ativa" : "Inativa"}
    </button>
  );
}
