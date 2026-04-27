"use client";

import { useEffect, useState } from "react";

type Mensagem = {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  lido: boolean;
  criadoEm: string;
};

export default function FornecedorContatosPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [abertos, setAbertos] = useState<Set<string>>(new Set());

  async function carregar() {
    const res = await fetch("/api/fornecedor/contatos");
    if (res.ok) setMensagens(await res.json());
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function marcarLida(id: string) {
    await fetch(`/api/fornecedor/contatos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lido: true }),
    });
    setMensagens((prev) => prev.map((m) => m.id === id ? { ...m, lido: true } : m));
  }

  function toggleAbrir(id: string) {
    setAbertos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const msg = mensagens.find((m) => m.id === id);
    if (msg && !msg.lido) marcarLida(id);
  }

  const naoLidas = mensagens.filter((m) => !m.lido).length;

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-500 text-sm mt-1">Contatos recebidos pelo formulário do seu perfil.</p>
        </div>
        {naoLidas > 0 && (
          <span className="bg-[#2E86AB] text-white text-sm font-semibold px-3 py-1 rounded-full">
            {naoLidas} não lida{naoLidas !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {mensagens.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">📩</p>
          <p className="text-gray-500">Nenhuma mensagem recebida ainda.</p>
          <p className="text-sm text-gray-400 mt-1">Ative o formulário de contato no seu perfil para começar a receber.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mensagens.map((m) => {
            const estaAberto = abertos.has(m.id) || !m.lido;
            return (
              <div key={m.id} className={`bg-white rounded-xl border p-5 ${m.lido ? "border-gray-100" : "border-[#2E86AB]/30"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {!m.lido && <span className="w-2 h-2 rounded-full bg-[#2E86AB] shrink-0" />}
                      <span className="font-semibold text-gray-900 text-sm">{m.nome}</span>
                      <a href={`mailto:${m.email}`} className="text-xs text-[#2E86AB] hover:underline">{m.email}</a>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{new Date(m.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>

                    {estaAberto ? (
                      <p className="text-sm text-gray-700 whitespace-pre-line">{m.mensagem}</p>
                    ) : (
                      <button onClick={() => toggleAbrir(m.id)} className="text-xs text-[#2E86AB] hover:underline">
                        Ver mensagem →
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {estaAberto && (
                      <button onClick={() => toggleAbrir(m.id)} className="text-xs text-gray-400 hover:text-gray-600">
                        Fechar
                      </button>
                    )}
                    {m.lido ? null : (
                      <button onClick={() => marcarLida(m.id)} className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors">
                        Marcar lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
