"use client";
import { useState } from "react";

type Proposta = {
  id: string;
  empresa: string;
  cnpj: string;
  responsavel: string;
  whatsapp: string;
  email: string;
  oque: string;
  quantidade: string;
  logradouro: string;
  numero: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  cep: string | null;
  prazo: string | null;
  criadoEm: Date | string;
};

function fmt(d: Date | string) {
  return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function PropostasClient({ propostas: initial }: { propostas: Proposta[] }) {
  const [propostas, setPropostas] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remover esta proposta?")) return;
    setDeleting(id);
    await fetch(`/api/admin/propostas/${id}`, { method: "DELETE" });
    setPropostas((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  }

  const ESTADO_REGIAO: Record<string, string> = {
    AC:"Norte",AP:"Norte",AM:"Norte",PA:"Norte",RO:"Norte",RR:"Norte",TO:"Norte",
    AL:"Nordeste",BA:"Nordeste",CE:"Nordeste",MA:"Nordeste",
    PB:"Nordeste",PE:"Nordeste",PI:"Nordeste",RN:"Nordeste",SE:"Nordeste",
    DF:"Centro-Oeste",GO:"Centro-Oeste",MT:"Centro-Oeste",MS:"Centro-Oeste",
    ES:"Sudeste",MG:"Sudeste",RJ:"Sudeste",SP:"Sudeste",
    PR:"Sul",RS:"Sul",SC:"Sul",
  };

  if (!propostas.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-gray-500">Nenhuma proposta recebida ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {propostas.map((p) => {
        const open = expanded === p.id;
        const regiao = ESTADO_REGIAO[p.estado.toUpperCase()] ?? "—";
        const endereco = [p.logradouro, p.numero, p.bairro, p.cidade, p.estado, p.cep].filter(Boolean).join(", ");
        return (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(open ? null : p.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.empresa}</p>
                  <p className="text-sm text-gray-500 truncate">{p.oque} — {p.quantidade}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {p.estado} / {regiao}
                </span>
                <span className="text-xs text-gray-400">{fmt(p.criadoEm)}</span>
                <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
              </div>
            </button>

            {open && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">CNPJ:</span> <span className="font-medium">{p.cnpj}</span></div>
                  <div><span className="text-gray-500">Responsável:</span> <span className="font-medium">{p.responsavel}</span></div>
                  <div>
                    <span className="text-gray-500">WhatsApp:</span>{" "}
                    <a
                      href={`https://wa.me/55${p.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      {p.whatsapp}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">E-mail:</span>{" "}
                    <a href={`mailto:${p.email}`} className="text-blue-600 hover:underline font-medium">
                      {p.email}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Produto/Serviço:</span>{" "}
                    <span className="font-medium">{p.oque}</span>
                  </div>
                  <div><span className="text-gray-500">Quantidade:</span> <span className="font-medium">{p.quantidade}</span></div>
                  {p.prazo && <div><span className="text-gray-500">Prazo:</span> <span className="font-medium">{p.prazo}</span></div>}
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Endereço de entrega:</span>{" "}
                    <span className="font-medium">{endereco}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === p.id ? "Removendo..." : "🗑️ Remover"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
