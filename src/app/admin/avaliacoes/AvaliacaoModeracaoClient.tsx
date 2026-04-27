"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Avaliacao = {
  id: string;
  nome: string;
  email: string | null;
  nota: number;
  comentario: string;
  status: string;
  criadoEm: Date | string;
  fornecedor: { id: string; nome: string; slug: string };
};

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(nota)}{"☆".repeat(5 - nota)}
    </span>
  );
}

function AvaliacaoCard({ av, onAprovar, onRejeitar, onExcluir, loading }: {
  av: Avaliacao;
  onAprovar?: () => void;
  onRejeitar?: () => void;
  onExcluir?: () => void;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Estrelas nota={av.nota} />
            <span className="font-semibold text-gray-900 text-sm">{av.nome}</span>
            {av.email && <span className="text-xs text-gray-400">{av.email}</span>}
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-[#2E86AB] font-medium">{av.fornecedor.nome}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{av.comentario}</p>
          <p className="text-xs text-gray-400 mt-2">{new Date(av.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {onAprovar && (
            <button onClick={onAprovar} disabled={loading} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50">
              Aprovar
            </button>
          )}
          {onRejeitar && (
            <button onClick={onRejeitar} disabled={loading} className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50">
              Rejeitar
            </button>
          )}
          {onExcluir && (
            <button onClick={onExcluir} disabled={loading} className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AvaliacaoModeracaoClient({
  pendentes: inicial_pendentes,
  aprovadas: inicial_aprovadas,
  rejeitadas: inicial_rejeitadas,
}: {
  pendentes: Avaliacao[];
  aprovadas: Avaliacao[];
  rejeitadas: Avaliacao[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"PENDENTE" | "APROVADO" | "REJEITADO">("PENDENTE");
  const [loading, setLoading] = useState(false);

  async function setStatus(id: string, status: string) {
    setLoading(true);
    await fetch(`/api/admin/avaliacoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta avaliação permanentemente?")) return;
    setLoading(true);
    await fetch(`/api/admin/avaliacoes/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  const lists: Record<string, Avaliacao[]> = {
    PENDENTE: inicial_pendentes,
    APROVADO: inicial_aprovadas,
    REJEITADO: inicial_rejeitadas,
  };

  const tabs = [
    { key: "PENDENTE", label: "Pendentes", count: inicial_pendentes.length, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { key: "APROVADO", label: "Aprovadas", count: inicial_aprovadas.length, color: "text-green-700 bg-green-50 border-green-200" },
    { key: "REJEITADO", label: "Rejeitadas", count: inicial_rejeitadas.length, color: "text-gray-600 bg-gray-50 border-gray-200" },
  ];

  return (
    <div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              tab === t.key ? t.color : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === t.key ? "" : "bg-gray-100 text-gray-600"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {lists[tab].length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-12 text-center text-gray-400">
          <p className="text-3xl mb-2">⭐</p>
          <p>Nenhuma avaliação {tab === "PENDENTE" ? "pendente" : tab === "APROVADO" ? "aprovada" : "rejeitada"}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lists[tab].map((av) => (
            <AvaliacaoCard
              key={av.id}
              av={av}
              loading={loading}
              onAprovar={tab !== "APROVADO" ? () => setStatus(av.id, "APROVADO") : undefined}
              onRejeitar={tab !== "REJEITADO" ? () => setStatus(av.id, "REJEITADO") : undefined}
              onExcluir={() => excluir(av.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
