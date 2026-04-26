import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "./SearchBar";
import MobileFilters from "./MobileFilters";

export const revalidate = 60;

const PLANO_LABEL: Record<string, string> = {
  BASICO: "Básico",
  DESTAQUE: "Destaque",
  PREMIUM: "Premium",
};

const PLANO_COLOR: Record<string, string> = {
  BASICO: "bg-gray-100 text-gray-600",
  DESTAQUE: "bg-blue-100 text-blue-700",
  PREMIUM: "bg-yellow-100 text-yellow-700",
};

const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

function buildUrl(params: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  if (params.categoria) p.set("categoria", params.categoria);
  if (params.regiao) p.set("regiao", params.regiao);
  if (params.q) p.set("q", params.q);
  const str = p.toString();
  return `/fornecedores${str ? `?${str}` : ""}`;
}

export default async function Fornecedores({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; regiao?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  const categoriaFiltro = params.categoria
    ? await prisma.categoria.findUnique({ where: { slug: params.categoria } })
    : null;

  const fornecedores = await prisma.fornecedor.findMany({
    where: {
      ativo: true,
      ...(categoriaFiltro ? { categoriaId: categoriaFiltro.id } : {}),
      ...(params.regiao ? { regioes: { has: params.regiao } } : {}),
      ...(params.q
        ? {
            OR: [
              { nome: { contains: params.q, mode: "insensitive" } },
              { descricao: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { categoria: true },
    orderBy: [{ plano: "desc" }, { recomendado: "desc" }, { nome: "asc" }],
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[#1B3A6B] text-white py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Fornecedores</h1>
            <p className="text-white/60">
              {fornecedores.length} fornecedor{fornecedores.length !== 1 ? "es" : ""} encontrado
              {fornecedores.length !== 1 ? "s" : ""}
              {params.q && <span> para &ldquo;{params.q}&rdquo;</span>}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
          {/* Sidebar de filtros — desktop */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">Categorias</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={buildUrl({ regiao: params.regiao, q: params.q })}
                    className={`block px-3 py-1.5 rounded-lg text-sm ${
                      !params.categoria ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todas
                  </Link>
                </li>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={buildUrl({ categoria: c.slug, regiao: params.regiao, q: params.q })}
                      className={`block px-3 py-1.5 rounded-lg text-sm ${
                        params.categoria === c.slug ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {c.icone} {c.nome}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-gray-800 mt-6 mb-4">Região</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={buildUrl({ categoria: params.categoria, q: params.q })}
                    className={`block px-3 py-1.5 rounded-lg text-sm ${
                      !params.regiao ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todas
                  </Link>
                </li>
                {REGIOES.map((r) => (
                  <li key={r}>
                    <Link
                      href={buildUrl({ categoria: params.categoria, regiao: r, q: params.q })}
                      className={`block px-3 py-1.5 rounded-lg text-sm ${
                        params.regiao === r ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {r}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            {/* Filtros mobile */}
            <MobileFilters
              categorias={categorias}
              categoriaAtiva={params.categoria}
              regiaoAtiva={params.regiao}
              q={params.q}
            />

            {/* Barra de busca */}
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>

            {/* Lista de fornecedores */}
            {fornecedores.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
                <p className="text-lg">Nenhum fornecedor encontrado.</p>
                <Link
                  href="/fornecedores"
                  className="text-[#2E86AB] text-sm mt-2 inline-block hover:underline"
                >
                  Ver todos
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {fornecedores.map((f) => (
                  <Link
                    key={f.id}
                    href={`/fornecedores/${f.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all group flex gap-5"
                  >
                    {/* Logo / avatar */}
                    <div className="shrink-0 self-start">
                      {f.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.logo}
                          alt={f.nome}
                          className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                          {f.categoria.icone ?? "🏢"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {f.categoria.nome}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${PLANO_COLOR[f.plano]}`}>
                          {PLANO_LABEL[f.plano]}
                        </span>
                        {f.recomendado && (
                          <span className="text-xs text-[#2E86AB] font-semibold">★ Recomendado por Johnny</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1B3A6B] mb-1">
                        {f.nome}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{f.descricao}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {f.regioes.map((r) => (
                          <span key={r} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 self-center text-[#2E86AB] font-medium text-sm hidden sm:block">
                      Ver perfil →
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
