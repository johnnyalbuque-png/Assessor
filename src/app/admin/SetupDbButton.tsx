"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupDbButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSetup() {
    setLoading(true);
    setStatus("idle");
    setError("");
    try {
      const res = await fetch("/api/admin/setup-db", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao configurar banco");
        setStatus("error");
      } else {
        setStatus("ok");
        setTimeout(() => router.refresh(), 800);
      }
    } catch {
      setError("Erro de conexão");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSetup}
        disabled={loading}
        className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        {loading ? "Atualizando banco..." : "🔧 Atualizar estrutura do banco"}
      </button>
      {status === "ok" && (
        <p className="text-green-600 text-sm mt-2">✓ Banco atualizado com sucesso! Recarregando...</p>
      )}
      {status === "error" && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
