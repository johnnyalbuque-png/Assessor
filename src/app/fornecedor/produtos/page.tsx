"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string | null;
  ativo: boolean;
  ordem: number;
};

const EMPTY = { nome: "", descricao: "", preco: "", ordem: 0 };

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    const res = await fetch("/api/fornecedor/produtos");
    if (res.ok) setProdutos(await res.json());
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function iniciarEdicao(p: Produto) {
    setEditId(p.id);
    setForm({ nome: p.nome, descricao: p.descricao ?? "", preco: p.preco ?? "", ordem: p.ordem });
    setErro("");
  }

  function cancelar() {
    setEditId(null);
    setForm(EMPTY);
    setErro("");
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSaving(true);
    try {
      const url = editId ? `/api/fornecedor/produtos/${editId}` : "/api/fornecedor/produtos";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await carregar();
        cancelar();
      } else {
        const d = await res.json();
        setErro(d.error || "Erro ao salvar");
      }
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/fornecedor/produtos/${id}`, { method: "DELETE" });
    await carregar();
  }

  async function toggleAtivo(p: Produto) {
    await fetch(`/api/fornecedor/produtos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !p.ativo }),
    });
    await carregar();
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos e Serviços</h1>
        {!editId && (
          <button onClick={() => { setEditId("novo"); setForm(EMPTY); }} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors">
            + Adicionar
          </button>
        )}
      </div>

      {(editId) && (
        <form onSubmit={salvar} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">{editId === "novo" ? "Novo produto/serviço" : "Editar produto"}</h2>
          {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input className="input" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} required placeholder="Ex: Suporte técnico 24h" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
              <input className="input" value={form.preco} onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))} placeholder="Ex: R$ 99/mês ou Consultar" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea className="input min-h-[80px] resize-y" value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} placeholder="Breve descrição..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordem (menor = primeiro)</label>
            <input type="number" className="input w-24" value={form.ordem} onChange={(e) => setForm((f) => ({ ...f, ordem: Number(e.target.value) }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={cancelar} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {produtos.length === 0 && !editId ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">📦</p>
          <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {produtos.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${p.ativo ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{p.nome}</h3>
                  {p.preco && <span className="text-xs font-bold text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded-full">{p.preco}</span>}
                  {!p.ativo && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">inativo</span>}
                </div>
                {p.descricao && <p className="text-sm text-gray-500 mt-0.5">{p.descricao}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleAtivo(p)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {p.ativo ? "Desativar" : "Ativar"}
                </button>
                <button onClick={() => iniciarEdicao(p)} className="text-xs text-[#2E86AB] hover:underline">Editar</button>
                <button onClick={() => excluir(p.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; }
        .input:focus { border-color: #1B3A6B; box-shadow: 0 0 0 3px rgba(27,58,107,0.1); }
      `}</style>
    </div>
  );
}
