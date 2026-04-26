"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import PriceInput from "@/components/PriceInput";

type Promocao = {
  id: string;
  titulo: string;
  descricao: string;
  valor: string | null;
  regras: string | null;
  imagem: string | null;
  validade: string | null;
  ativo: boolean;
};

const EMPTY = { titulo: "", descricao: "", valor: "", regras: "", imagem: "", validade: "" };

export default function PromocoesPage() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    const res = await fetch("/api/fornecedor/promocoes");
    if (res.ok) setPromocoes(await res.json());
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function iniciarEdicao(p: Promocao) {
    setEditId(p.id);
    setForm({ titulo: p.titulo, descricao: p.descricao, valor: p.valor ?? "", regras: p.regras ?? "", imagem: p.imagem ?? "", validade: p.validade ? p.validade.split("T")[0] : "" });
    setErro("");
  }

  function cancelar() { setEditId(null); setForm(EMPTY); setErro(""); }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); setSaving(true);
    try {
      const url = editId ? `/api/fornecedor/promocoes/${editId}` : "/api/fornecedor/promocoes";
      const payload = { ...form, valor: form.valor || null, regras: form.regras || null, imagem: form.imagem || null, validade: form.validade || null };
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { await carregar(); cancelar(); }
      else { const d = await res.json(); setErro(d.error || "Erro ao salvar"); }
    } catch { setErro("Erro de conexão"); }
    finally { setSaving(false); }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta promoção?")) return;
    await fetch(`/api/fornecedor/promocoes/${id}`, { method: "DELETE" });
    await carregar();
  }

  async function toggleAtivo(p: Promocao) {
    await fetch(`/api/fornecedor/promocoes/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ativo: !p.ativo }) });
    await carregar();
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]";

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promoções</h1>
        {!editId && (
          <button onClick={() => { setEditId("nova"); setForm(EMPTY); }} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors">
            + Adicionar
          </button>
        )}
      </div>

      {editId && (
        <form onSubmit={salvar} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">{editId === "nova" ? "Nova promoção" : "Editar promoção"}</h2>
          {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input className={inp} required value={form.titulo} onChange={(e) => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: 20% OFF para novos provedores" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea className={`${inp} min-h-[80px] resize-y`} required value={form.descricao} onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Detalhe a promoção..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor / Desconto</label>
              <PriceInput value={form.valor} onChange={(v) => setForm(f => ({ ...f, valor: v }))} placeholder="199,90" />
              <p className="text-xs text-gray-400 mt-1">Opcional. Ex: 199,90 ou "20% OFF"</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Válido até</label>
              <input type="date" className={inp} value={form.validade} onChange={(e) => setForm(f => ({ ...f, validade: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regras / Condições (opcional)</label>
            <textarea className={`${inp} min-h-[80px] resize-y`} value={form.regras} onChange={(e) => setForm(f => ({ ...f, regras: e.target.value }))} placeholder="Ex: Válido somente para novas contratações. Não cumulativo com outras promoções..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem (opcional)</label>
            <ImageUpload value={form.imagem} onChange={(url) => setForm(f => ({ ...f, imagem: url }))} tipo="banner" aspect="wide" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={cancelar} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {promocoes.length === 0 && !editId ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">🏷️</p>
          <p className="text-gray-500">Nenhuma promoção cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promocoes.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border ${p.ativo ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              {p.imagem && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagem} alt={p.titulo} className="w-full h-32 object-cover rounded-t-xl" />
              )}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{p.titulo}</h3>
                    {p.valor && <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">R$ {p.valor}</span>}
                    {!p.ativo && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">inativa</span>}
                  </div>
                  <p className="text-sm text-gray-500">{p.descricao}</p>
                  {p.regras && <p className="text-xs text-gray-400 mt-1 italic">{p.regras}</p>}
                  {p.validade && <p className="text-xs text-gray-400 mt-1">Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleAtivo(p)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{p.ativo ? "Desativar" : "Ativar"}</button>
                  <button onClick={() => iniciarEdicao(p)} className="text-xs text-[#2E86AB] hover:underline">Editar</button>
                  <button onClick={() => excluir(p.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
