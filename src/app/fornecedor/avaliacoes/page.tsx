"use client";

import { useEffect, useState } from "react";

type Avaliacao = {
  id: string;
  nome: string;
  nota: number;
  comentario: string;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  criadoEm: string;
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PENDENTE:  { label: "Aguardando aprovação", cls: "bg-amber-50 text-amber-700" },
  APROVADO:  { label: "Aprovada",             cls: "bg-green-50 text-green-700" },
  REJEITADO: { label: "Rejeitada",            cls: "bg-red-50 text-red-500" },
};

function Estrelas({ nota }: { nota: number }) {
  return <span className="text-yellow-400">{"★".repeat(nota)}{"☆".repeat(5 - nota)}</span>;
}

export default function FornecedorAvaliacoesPage() {
  const [avaliacoesAtivo, setAvaliacoesAtivo] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  async function carregar() {
    const res = await fetch("/api/fornecedor/avaliacoes");
    if (res.ok) {
      const data = await res.json();
      setAvaliacoesAtivo(data.avaliacoesAtivo);
      setAvaliacoes(data.avaliacoes);
    }
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function toggle() {
    setToggling(true);
    await fetch("/api/fornecedor/avaliacoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avaliacoesAtivo: !avaliacoesAtivo }),
    });
    setAvaliacoesAtivo((v) => !v);
    setToggling(false);
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>;

  const aprovadas = avaliacoes.filter((a) => a.status === "APROVADO");
  const pendentes = avaliacoes.filter((a) => a.status === "PENDENTE");
  const media = aprovadas.length > 0 ? (aprovadas.reduce((s, a) => s + a.nota, 0) / aprovadas.length).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
          <p className="text-gray-500 text-sm mt-1">Avaliações dos visitantes sobre o seu perfil.</p>
        </div>
        <button
          onClick={toggle}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
            avaliacoesAtivo
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${avaliacoesAtivo ? "bg-green-500" : "bg-gray-400"}`} />
          {avaliacoesAtivo ? "Avaliações ativas" : "Avaliações inativas"}
        </button>
      </div>

      {!avaliacoesAtivo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          As avaliações estão desativadas. Visitantes não conseguem enviar avaliações enquanto essa opção estiver desligada.
        </div>
      )}

      {/* Resumo */}
      {aprovadas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-[#1B3A6B]">{media}</p>
            <div className="text-yellow-400 text-lg mt-0.5">{"★".repeat(Math.round(Number(media)))}{"☆".repeat(5 - Math.round(Number(media)))}</div>
            <p className="text-xs text-gray-400 mt-1">{aprovadas.length} avaliação{aprovadas.length !== 1 ? "ões" : ""}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = aprovadas.filter((a) => a.nota === n).length;
              const pct = aprovadas.length > 0 ? (count / aprovadas.length) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-3 text-right">{n}</span>
                  <span className="text-yellow-400">★</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pendentes.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm text-amber-700 font-medium mb-1">⏳ {pendentes.length} avaliação{pendentes.length !== 1 ? "ões" : ""} aguardando moderação</p>
          <p className="text-xs text-amber-600">A equipe INTER&apos;ISP irá aprovar ou rejeitar em breve.</p>
        </div>
      )}

      {avaliacoes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">⭐</p>
          <p className="text-gray-500">Nenhuma avaliação ainda.</p>
          {!avaliacoesAtivo && <p className="text-sm text-gray-400 mt-1">Ative as avaliações para começar a recebê-las.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {avaliacoes.map((av) => {
            const s = STATUS_LABEL[av.status];
            return (
              <div key={av.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Estrelas nota={av.nota} />
                      <span className="font-semibold text-gray-800 text-sm">{av.nome}</span>
                    </div>
                    <p className="text-sm text-gray-600">{av.comentario}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{new Date(av.criadoEm).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${s.cls}`}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
