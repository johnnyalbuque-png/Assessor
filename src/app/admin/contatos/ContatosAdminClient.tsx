"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mensagem = {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  lido: boolean;
  criadoEm: Date | string;
  fornecedor: { id: string; nome: string; slug: string };
};

function MensagemCard({ m, onMarcar, onExcluir, loading }: {
  m: Mensagem;
  onMarcar: () => void;
  onExcluir: () => void;
  loading: boolean;
}) {
  const [aberto, setAberto] = useState(!m.lido);

  return (
    <div className={`bg-white rounded-xl border p-5 transition-colors ${m.lido ? "border-gray-100" : "border-[#2E86AB]/30"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {!m.lido && <span className="w-2 h-2 rounded-full bg-[#2E86AB] shrink-0" />}
            <span className="font-semibold text-gray-900 text-sm">{m.nome}</span>
            <a href={`mailto:${m.email}`} className="text-xs text-[#2E86AB] hover:underline">{m.email}</a>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 font-medium">{m.fornecedor.nome}</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{new Date(m.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>

          {aberto ? (
            <p className="text-sm text-gray-700 whitespace-pre-line">{m.mensagem}</p>
          ) : (
            <button onClick={() => setAberto(true)} className="text-xs text-[#2E86AB] hover:underline">
              Ver mensagem →
            </button>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onMarcar} disabled={loading} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${m.lido ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
            {m.lido ? "Marcar não lida" : "Marcar lida"}
          </button>
          <button onClick={onExcluir} disabled={loading} className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContatosAdminClient({ naoLidas, lidas }: { naoLidas: Mensagem[]; lidas: Mensagem[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"naoLidas" | "lidas">("naoLidas");
  const [loading, setLoading] = useState(false);

  async function marcar(id: string, lido: boolean) {
    setLoading(true);
    await fetch(`/api/admin/contatos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lido }) });
    setLoading(false);
    router.refresh();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta mensagem?")) return;
    setLoading(true);
    await fetch(`/api/admin/contatos/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  const lista = tab === "naoLidas" ? naoLidas : lidas;

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("naoLidas")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tab === "naoLidas" ? "border-[#2E86AB]/40 text-[#2E86AB] bg-blue-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
          Não lidas
          {naoLidas.length > 0 && <span className="bg-[#2E86AB] text-white text-xs px-1.5 py-0.5 rounded-full">{naoLidas.length}</span>}
        </button>
        <button onClick={() => setTab("lidas")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${tab === "lidas" ? "border-gray-300 text-gray-700 bg-gray-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
          Lidas <span className="text-xs text-gray-400">{lidas.length}</span>
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-12 text-center text-gray-400">
          <p className="text-3xl mb-2">📩</p>
          <p>Nenhuma mensagem {tab === "naoLidas" ? "não lida" : "lida"}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((m) => (
            <MensagemCard key={m.id} m={m} loading={loading}
              onMarcar={() => marcar(m.id, !m.lido)}
              onExcluir={() => excluir(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
