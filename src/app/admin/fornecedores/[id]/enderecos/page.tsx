"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

type Endereco = {
  id: string;
  nome: string | null;
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  cep: string | null;
};

const EMPTY = { nome: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "SP", cep: "" };

export default function AdminEnderecosPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    const res = await fetch(`/api/admin/fornecedores/${id}/enderecos`);
    if (res.ok) setEnderecos(await res.json());
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function iniciarEdicao(e: Endereco) {
    setEditId(e.id);
    setForm({ nome: e.nome ?? "", logradouro: e.logradouro, numero: e.numero ?? "", complemento: e.complemento ?? "", bairro: e.bairro ?? "", cidade: e.cidade, estado: e.estado, cep: e.cep ?? "" });
    setErro("");
  }

  function cancelar() { setEditId(null); setForm(EMPTY); setErro(""); }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(""); setSaving(true);
    try {
      const url = editId && editId !== "novo"
        ? `/api/admin/fornecedores/${id}/enderecos/${editId}`
        : `/api/admin/fornecedores/${id}/enderecos`;
      const res = await fetch(url, { method: editId && editId !== "novo" ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { await carregar(); cancelar(); }
      else { const d = await res.json(); setErro(d.error || "Erro ao salvar"); }
    } catch { setErro("Erro de conexão"); }
    finally { setSaving(false); }
  }

  async function excluir(endId: string) {
    if (!confirm("Excluir este endereço?")) return;
    await fetch(`/api/admin/fornecedores/${id}/enderecos/${endId}`, { method: "DELETE" });
    await carregar();
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/fornecedores/${id}`} className="text-sm text-[#2E86AB] hover:underline">← Voltar ao fornecedor</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Endereços / Lojas</h1>
        </div>
        {!editId && (
          <button onClick={() => { setEditId("novo"); setForm(EMPTY); }} className="bg-[#1B3A6B] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors">
            + Adicionar endereço
          </button>
        )}
      </div>

      {editId && (
        <form onSubmit={salvar} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editId === "novo" ? "Novo endereço" : "Editar endereço"}</h2>
          {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome / Identificação</label>
              <input className={inp} value={form.nome} onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Sede Principal, Filial SP" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro *</label>
              <input className={inp} required value={form.logradouro} onChange={(e) => setForm(f => ({ ...f, logradouro: e.target.value }))} placeholder="Rua, Avenida, Alameda..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input className={inp} value={form.numero} onChange={(e) => setForm(f => ({ ...f, numero: e.target.value }))} placeholder="123" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input className={inp} value={form.complemento} onChange={(e) => setForm(f => ({ ...f, complemento: e.target.value }))} placeholder="Sala 10, Andar 2..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input className={inp} value={form.bairro} onChange={(e) => setForm(f => ({ ...f, bairro: e.target.value }))} placeholder="Centro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input className={inp} value={form.cep} onChange={(e) => setForm(f => ({ ...f, cep: e.target.value }))} placeholder="00000-000" maxLength={9} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
              <input className={inp} required value={form.cidade} onChange={(e) => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="São Paulo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select className={inp} required value={form.estado} onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="bg-[#1B3A6B] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={cancelar} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>
      ) : enderecos.length === 0 && !editId ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">📍</p>
          <p className="text-gray-500">Nenhum endereço cadastrado ainda.</p>
          <p className="text-sm text-gray-400 mt-1">Clique em &quot;+ Adicionar endereço&quot; para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enderecos.map((end) => (
            <div key={end.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-4">
              <div>
                {end.nome && <p className="text-xs font-semibold text-[#2E86AB] uppercase tracking-wide mb-0.5">{end.nome}</p>}
                <p className="text-sm font-medium text-gray-800">
                  {end.logradouro}{end.numero ? `, ${end.numero}` : ""}{end.complemento ? ` — ${end.complemento}` : ""}
                </p>
                <p className="text-sm text-gray-500">
                  {[end.bairro, end.cidade, end.estado].filter(Boolean).join(", ")}{end.cep ? ` · CEP ${end.cep}` : ""}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => iniciarEdicao(end)} className="text-xs text-[#2E86AB] hover:underline">Editar</button>
                <button onClick={() => excluir(end.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
