"use client";

import { useState } from "react";

export default function ContatoForm({ fornecedorId, nomeFornecedor }: { fornecedorId: string; nomeFornecedor: string }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fornecedorId, nome, email, mensagem }),
      });
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Mensagem enviada! Em breve o fornecedor entrará em contato." });
        setNome(""); setEmail(""); setMensagem("");
      } else {
        const d = await res.json();
        setMsg({ tipo: "erro", texto: d.error || "Erro ao enviar." });
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão." });
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">Envie uma mensagem diretamente para <strong className="text-gray-700">{nomeFornecedor}</strong>.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input className={inp} required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" maxLength={80} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
          <input className={inp} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem *</label>
        <textarea className={`${inp} resize-none`} required rows={4} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Descreva sua necessidade ou dúvida..." maxLength={1000} />
      </div>

      {msg && (
        <p className={`text-sm px-3 py-2 rounded-lg ${msg.tipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {msg.texto}
        </p>
      )}

      <button type="submit" disabled={loading} className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto">
        {loading ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
