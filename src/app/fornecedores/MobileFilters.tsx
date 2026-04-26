"use client";
import Link from "next/link";
import { useState } from "react";

type Categoria = { id: string; nome: string; slug: string; icone: string | null };

const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export default function MobileFilters({
  categorias,
  categoriaAtiva,
  regiaoAtiva,
  q,
}: {
  categorias: Categoria[];
  categoriaAtiva?: string;
  regiaoAtiva?: string;
  q?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasFilters = !!categoriaAtiva || !!regiaoAtiva;

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.categoria) p.set("categoria", params.categoria);
    if (params.regiao) p.set("regiao", params.regiao);
    if (params.q) p.set("q", params.q);
    const str = p.toString();
    return `/fornecedores${str ? `?${str}` : ""}`;
  }

  return (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700"
      >
        <span>Filtros{hasFilters ? " • Ativo" : ""}</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="bg-white border border-gray-100 rounded-xl mt-2 p-4 space-y-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categoria</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildUrl({ regiao: regiaoAtiva, q })}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  !categoriaAtiva ? "bg-[#1B3A6B] text-white border-[#1B3A6B]" : "border-gray-200 text-gray-600"
                }`}
              >
                Todas
              </Link>
              {categorias.map((c) => (
                <Link
                  key={c.id}
                  href={buildUrl({ categoria: c.slug, regiao: regiaoAtiva, q })}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    categoriaAtiva === c.slug
                      ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {c.icone} {c.nome}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Região</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildUrl({ categoria: categoriaAtiva, q })}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  !regiaoAtiva ? "bg-[#1B3A6B] text-white border-[#1B3A6B]" : "border-gray-200 text-gray-600"
                }`}
              >
                Todas
              </Link>
              {REGIOES.map((r) => (
                <Link
                  key={r}
                  href={buildUrl({ categoria: categoriaAtiva, regiao: r, q })}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    regiaoAtiva === r ? "bg-[#1B3A6B] text-white border-[#1B3A6B]" : "border-gray-200 text-gray-600"
                  }`}
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
