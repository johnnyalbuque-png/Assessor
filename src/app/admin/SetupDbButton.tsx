"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupDbButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSetup() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/setup-db", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao configurar banco");
      } else {
        router.refresh();
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSetup}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        {loading ? "Configurando banco..." : "🔧 Criar tabelas no banco"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
