"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import PriceInput from "@/components/PriceInput";

export default function ProdutoForm({ fornecedorId }: { fornecedorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErro("");
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement)?.value;

    const res = await fetch(`/api/admin/fornecedores/${fornecedorId}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: get("nome"),
        descricao: get("descricao") || null,
        preco: preco || null,
        imagem: imagem || null,
        ativo,
        ordem: parseInt(get("ordem") || "0", 10),
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setErro(d.error || "Erro ao salvar");
    } else {
      form.reset(); setAtivo(true); setPreco(""); setImagem("");
      router.refresh();
    }
    setLoading(false);
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input name="nome" required className={field} placeholder="Ex: OLT GPON 8 portas" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea name="descricao" rows={2} className={field} placeholder="Breve descrição..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
          <PriceInput value={preco} onChange={setPreco} placeholder="2.500,00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
          <input name="ordem" type="number" defaultValue="0" className={field} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem (opcional)</label>
        <ImageUpload value={imagem} onChange={setImagem} tipo="default" aspect="wide" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="w-4 h-4 accent-[#1B3A6B]" />
        <span className="text-sm text-gray-700">Ativo (visível no perfil)</span>
      </label>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <button type="submit" disabled={loading} className="w-full bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
        {loading ? "Salvando..." : "Adicionar produto"}
      </button>
    </form>
  );
}
