"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSeed() {
    if (!confirm("Criar as 10 categorias e 2 fornecedores de exemplo?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    if (res.ok) {
      setDone(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } else {
      alert("Erro ao executar seed. Tente novamente.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <p className="text-green-700 font-medium text-sm">
        ✅ Categorias e fornecedores criados com sucesso! Recarregando...
      </p>
    );
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
    >
      {loading ? "Criando dados..." : "🚀 Inicializar banco de dados"}
    </button>
  );
}
