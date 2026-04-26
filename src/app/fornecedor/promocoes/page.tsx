"use client";

import { useEffect, useState } from "react";

type Promocao = {
  id: string;
  titulo: string;
  descricao: string;
  validade: string | null;
  ativo: boolean;
};

const EMPTY = { titulo: "", descricao: "", validade: "" };

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
    setForm({
      titulo: p.titulo,
      descricao: p.descricao,
      validade: p.validade ? p.validade.split("T")[0] : "",
    });
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
      const url = editId ? `/api/fornecedor/promocoes/${editId}` : "/api/fornecedor/promocoes";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, validade: form.validade || null }),
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
    if (!confirm("Excluir esta promoção?")) return;
    await fetch(`/api/fornecedor/promocoes/${id}`, { method: "DELETE" });
    await carregar();
  }

  async function toggleAtivo(p: Promocao) {
    await fetch(`/api/fornecedor/promocoes/${p.id}`, {
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
            <input className="input" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required placeholder="Ex: 20% de desconto em instalação" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea className="input min-h-[80px] resize-y" value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} required placeholder="Detalhe a promoção..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Válido até (opcional)</label>
            <input type="date" className="input w-48" value={form.validade} onChange={(e) => setForm((f) => ({ ...f, validade: e.target.value }))} />
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

      {promocoes.length === 0 && !editId ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">🏷️</p>
          <p className="text-gray-500">Nenhuma promoção cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promocoes.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border p-4 ${p.ativo ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{p.titulo}</h3>
                    {!p.ativo && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">inativa</span>}
                  </div>
                  <p className="text-sm text-gray-500">{p.descricao}</p>
                  {p.validade && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleAtivo(p)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    {p.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => iniciarEdicao(p)} className="text-xs text-[#2E86AB] hover:underline">Editar</button>
                  <button onClick={() => excluir(p.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Excluir</button>
                </div>
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
