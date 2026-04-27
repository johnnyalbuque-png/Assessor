"use client";

import { useState } from "react";

export default function AvaliacaoForm({ fornecedorId }: { fornecedorId: string }) {
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nota === 0) { setMsg({ tipo: "erro", texto: "Selecione uma nota de 1 a 5 estrelas." }); return; }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fornecedorId, nome, email, nota, comentario }),
      });
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Obrigado! Sua avaliação foi enviada e será publicada após moderação." });
        setNota(0); setNome(""); setEmail(""); setComentario("");
      } else {
        const d = await res.json();
        setMsg({ tipo: "erro", texto: d.error || "Erro ao enviar avaliação." });
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
      {/* Star picker */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Sua nota *</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl leading-none transition-transform hover:scale-110"
            >
              <span className={(hover || nota) >= n ? "text-yellow-400" : "text-gray-200"}>★</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input className={inp} required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" maxLength={80} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail <span className="text-gray-400 font-normal">(não publicado)</span></label>
          <input className={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comentário *</label>
        <textarea className={`${inp} resize-none`} required rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Conte sua experiência com este fornecedor..." maxLength={600} />
      </div>

      {msg && (
        <p className={`text-sm px-3 py-2 rounded-lg ${msg.tipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {msg.texto}
        </p>
      )}

      <button type="submit" disabled={loading} className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
        {loading ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
