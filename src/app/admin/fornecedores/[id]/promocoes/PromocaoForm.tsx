"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PromocaoForm({ fornecedorId }: { fornecedorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ativo, setAtivo] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement)?.value;

    const res = await fetch(`/api/admin/fornecedores/${fornecedorId}/promocoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: get("titulo"),
        descricao: get("descricao"),
        validade: get("validade") || null,
        ativo,
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setErro(d.error || "Erro ao salvar");
    } else {
      form.reset();
      setAtivo(true);
      router.refresh();
    }
    setLoading(false);
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
        <input name="titulo" required className={field} placeholder="Ex: 10% OFF para novos clientes" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <textarea name="descricao" required rows={3} className={field} placeholder="Detalhes da promoção..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Válido até (opcional)</label>
        <input name="validade" type="date" className={field} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="w-4 h-4 accent-[#1B3A6B]" />
        <span className="text-sm text-gray-700">Ativa (visível no perfil)</span>
      </label>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <button type="submit" disabled={loading} className="w-full bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
        {loading ? "Salvando..." : "Adicionar promoção"}
      </button>
    </form>
  );
}
