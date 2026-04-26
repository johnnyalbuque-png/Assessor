"use client";

import { useState } from "react";

export default function ContaSection({ fornecedorId, emailAtual }: { fornecedorId: string; emailAtual?: string | null }) {
  const [email, setEmail] = useState(emailAtual ?? "");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/fornecedores/${fornecedorId}/conta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Acesso salvo! O fornecedor já pode fazer login." });
        setSenha("");
      } else {
        setMsg({ tipo: "erro", texto: d.error || "Erro ao salvar" });
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão" });
    } finally {
      setLoading(false);
    }
  }

  async function revogar() {
    if (!confirm("Remover acesso deste fornecedor?")) return;
    setLoading(true);
    setMsg(null);
    try {
      await fetch(`/api/admin/fornecedores/${fornecedorId}/conta`, { method: "DELETE" });
      setEmail("");
      setSenha("");
      setMsg({ tipo: "ok", texto: "Acesso removido." });
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">🔐 Acesso do Fornecedor</h3>
        {emailAtual && (
          <button onClick={revogar} disabled={loading} className="text-xs text-red-500 hover:text-red-700 transition-colors">
            Revogar acesso
          </button>
        )}
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.texto}
        </div>
      )}

      <form onSubmit={salvar} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail de acesso</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
              placeholder="fornecedor@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {emailAtual ? "Nova senha (deixe em branco para manter)" : "Senha inicial"}
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
              placeholder="••••••••"
              required={!emailAtual}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#142d54] transition-colors disabled:opacity-60"
          >
            {loading ? "Salvando..." : emailAtual ? "Atualizar acesso" : "Criar acesso"}
          </button>
          {emailAtual && (
            <span className="text-xs text-gray-400">Acesso ativo para {emailAtual}</span>
          )}
        </div>
      </form>
    </div>
  );
}
