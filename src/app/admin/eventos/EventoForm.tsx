"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

type EventoData = {
  id?: string;
  titulo?: string;
  descricao?: string;
  data?: string;
  local?: string | null;
  cidade?: string | null;
  link?: string | null;
  imagem?: string | null;
  ativo?: boolean;
  destaque?: boolean;
};

export default function EventoForm({ inicial }: { inicial?: EventoData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ativo, setAtivo] = useState(inicial?.ativo ?? true);
  const [destaque, setDestaque] = useState(inicial?.destaque ?? false);
  const [imagem, setImagem] = useState(inicial?.imagem ?? "");
  const editando = !!inicial?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement)?.value;

    const payload = {
      titulo: get("titulo"),
      descricao: get("descricao"),
      data: get("data"),
      local: get("local") || null,
      cidade: get("cidade") || null,
      link: get("link") || null,
      imagem: imagem || null,
      ativo,
      destaque,
    };

    const url = editando ? `/api/admin/eventos/${inicial!.id}` : "/api/admin/eventos";
    const method = editando ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    if (!res.ok) {
      const d = await res.json();
      setErro(d.error || "Erro ao salvar");
      setLoading(false);
      return;
    }
    router.push("/admin/eventos");
    router.refresh();
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
        <input name="titulo" required defaultValue={inicial?.titulo} className={field} placeholder="Ex: ABRINT 2026" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea name="descricao" rows={3} defaultValue={inicial?.descricao} className={field} placeholder="Descrição do evento..." />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
          <input
            name="data"
            type="datetime-local"
            required
            defaultValue={inicial?.data ? new Date(inicial.data).toISOString().slice(0, 16) : ""}
            className={field}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input name="cidade" defaultValue={inicial?.cidade ?? ""} className={field} placeholder="São Paulo - SP" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local / Venue</label>
          <input name="local" defaultValue={inicial?.local ?? ""} className={field} placeholder="Centro de Convenções" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link (inscrição / mais info)</label>
          <input name="link" defaultValue={inicial?.link ?? ""} className={field} placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem do evento (opcional)</label>
        <ImageUpload value={imagem} onChange={setImagem} tipo="banner" aspect="wide" hint="Recomendado: 1200×500 px" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="w-4 h-4 accent-[#1B3A6B]" />
          Visível no site
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="w-4 h-4 accent-[#2E86AB]" />
          Destaque ★
        </label>
      </div>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          {loading ? "Salvando..." : editando ? "Salvar alterações" : "Criar evento"}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
