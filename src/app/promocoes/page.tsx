import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { formatarPreco } from "@/lib/format";

export const revalidate = 60;

export default async function PromocoesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { fornecedores: true } } },
  }).catch(() => []);

  const promocoes = await prisma.promocao.findMany({
    where: {
      ativo: true,
      fornecedor: {
        ativo: true,
        ...(categoria ? { categoria: { slug: categoria } } : {}),
      },
    },
    include: { fornecedor: { include: { categoria: true } } },
    orderBy: { criadoEm: "desc" },
  }).catch(() => []);

  const hoje = new Date();
  const ativas = promocoes.filter((p) => !p.validade || new Date(p.validade) >= hoje);

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <div className="bg-[#1B3A6B] text-white py-14 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🏷️ Promoções Ativas</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Ofertas especiais de fornecedores verificados para provedores de internet.
          </p>
        </div>

        {/* Filtro por categoria */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto scrollbar-none">
            <Link
              href="/promocoes"
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categoria ? "bg-[#1B3A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/promocoes?categoria=${cat.slug}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoria === cat.slug ? "bg-[#1B3A6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.icone} {cat.nome}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {ativas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏷️</p>
              <p className="text-lg font-medium text-gray-500">Nenhuma promoção ativa no momento</p>
              <p className="text-sm mt-1">Volte em breve — novos fornecedores estão sempre adicionando ofertas.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{ativas.length} promoç{ativas.length !== 1 ? "ões" : "ão"} ativa{ativas.length !== 1 ? "s" : ""}</p>
              <div className="space-y-5">
                {ativas.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    {p.imagem && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagem} alt={p.titulo} className="w-full h-44 object-cover" />
                    )}
                    <div className="border-l-4 border-[#2E86AB] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs bg-[#1B3A6B]/10 text-[#1B3A6B] px-2.5 py-0.5 rounded-full font-medium">
                            {p.fornecedor.categoria.icone} {p.fornecedor.categoria.nome}
                          </span>
                          <Link href={`/fornecedores/${p.fornecedor.slug}`} className="text-xs text-[#2E86AB] font-medium hover:underline">
                            {p.fornecedor.nome}
                          </Link>
                        </div>
                        {p.valor && (
                          <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full shrink-0">
                            {formatarPreco(p.valor) ?? p.valor}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{p.titulo}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{p.descricao}</p>
                      {p.regras && (
                        <p className="text-xs text-gray-400 mt-3 italic border-t border-gray-100 pt-3">{p.regras}</p>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                        {p.validade && (
                          <p className="text-xs text-gray-400">
                            Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                        <Link
                          href={`/fornecedores/${p.fornecedor.slug}`}
                          className="text-sm font-medium text-[#2E86AB] hover:underline ml-auto"
                        >
                          Ver fornecedor →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
