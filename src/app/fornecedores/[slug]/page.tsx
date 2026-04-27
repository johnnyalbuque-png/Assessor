import { notFound } from "next/navigation";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactButtons from "./ContactButtons";
import AvaliacaoForm from "./AvaliacaoForm";
import { formatarPreco } from "@/lib/format";

type FornecedorPage = Prisma.FornecedorGetPayload<{
  include: { categoria: true; produtos: true; promocoes: true };
}>;

export const revalidate = 60;

const PLANO_CONFIG = {
  PREMIUM: { label: "Premium", cor: "bg-amber-100 text-amber-700 border-amber-200" },
  DESTAQUE: { label: "Destaque", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  BASICO: { label: "Básico", cor: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default async function PerfilFornecedor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // New columns (imagem/valor/regras) may not exist yet — fallback to safe query
  const fornecedor: FornecedorPage | null = await prisma.fornecedor.findUnique({
    where: { slug, ativo: true },
    include: {
      categoria: true,
      produtos: { where: { ativo: true }, orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }] },
      promocoes: { where: { ativo: true }, orderBy: { criadoEm: "desc" } },
    },
  }).catch(() =>
    prisma.fornecedor.findUnique({
      where: { slug, ativo: true },
      include: {
        categoria: true,
        produtos: {
          where: { ativo: true },
          orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }],
          select: { id: true, nome: true, descricao: true, preco: true, ativo: true, ordem: true, fornecedorId: true, criadoEm: true },
        },
        promocoes: {
          where: { ativo: true },
          orderBy: { criadoEm: "desc" },
          select: { id: true, titulo: true, descricao: true, validade: true, ativo: true, fornecedorId: true, criadoEm: true },
        },
      },
    }).then((r) => r as unknown as FornecedorPage | null)
  );

  if (!fornecedor) notFound();

  const [enderecos, avaliacoes] = await Promise.all([
    prisma.endereco.findMany({
      where: { fornecedorId: fornecedor.id },
      orderBy: { criadoEm: "asc" },
    }).catch(() => []),
    prisma.avaliacao.findMany({
      where: { fornecedorId: fornecedor.id, status: "APROVADO" },
      orderBy: { criadoEm: "desc" },
    }).catch(() => []),
  ]);

  const avaliacoesAtivo = (fornecedor as Record<string, unknown>).avaliacoesAtivo as boolean | undefined;
  const mediaAvaliacao = avaliacoes.length > 0
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length)
    : null;

  const plano = PLANO_CONFIG[fornecedor.plano as keyof typeof PLANO_CONFIG] ?? PLANO_CONFIG.BASICO;

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Cover */}
        {fornecedor.banner ? (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fornecedor.banner} alt={fornecedor.nome} className="w-full h-full object-cover object-center" />
          </div>
        ) : (
          <div className="w-full h-44 bg-gradient-to-r from-[#1B3A6B] to-[#2E86AB]" />
        )}

        <div className="max-w-5xl mx-auto px-4 pb-16">
          {/* Card de identidade */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-10 relative z-10 p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Logo */}
              <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center">
                {fornecedor.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fornecedor.logo} alt={fornecedor.nome} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-3xl">{fornecedor.categoria.icone ?? "🏢"}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs bg-[#1B3A6B]/10 text-[#1B3A6B] px-2.5 py-0.5 rounded-full font-medium">
                    {fornecedor.categoria.nome}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${plano.cor}`}>
                    {plano.label}
                  </span>
                  {fornecedor.recomendado && (
                    <span className="text-xs bg-[#2E86AB] text-white px-2.5 py-0.5 rounded-full font-medium">
                      ★ Recomendado
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{fornecedor.nome}</h1>
                {fornecedor.tagline && (
                  <p className="text-[#2E86AB] font-medium text-sm">{fornecedor.tagline}</p>
                )}
                {fornecedor.regioes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {fornecedor.regioes.map((r) => (
                      <span key={r} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        📍 {r}
                      </span>
                    ))}
                  </div>
                )}
                {mediaAvaliacao !== null && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="text-yellow-400 text-sm leading-none">{"★".repeat(Math.round(mediaAvaliacao))}{"☆".repeat(5 - Math.round(mediaAvaliacao))}</span>
                    <span className="text-sm font-semibold text-gray-700">{mediaAvaliacao.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({avaliacoes.length} avaliação{avaliacoes.length !== 1 ? "ões" : ""})</span>
                  </div>
                )}
              </div>

              <ContactButtons
                fornecedorId={fornecedor.id}
                whatsapp={fornecedor.whatsapp}
                email={fornecedor.email}
                site={fornecedor.site}
                instagram={(fornecedor as Record<string, unknown>).instagram as string | null}
                linkedin={(fornecedor as Record<string, unknown>).linkedin as string | null}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Conteúdo principal */}
            <div className="md:col-span-2 space-y-8">
              {/* Sobre */}
              <section className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sobre a empresa</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{fornecedor.descricao}</p>
              </section>

              {/* Produtos / Serviços */}
              {fornecedor.produtos.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Produtos e serviços</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {fornecedor.produtos.map((p) => (
                      <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                        {p.imagem && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imagem} alt={p.nome} className="w-full h-36 object-cover" />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-800">{p.nome}</h3>
                            {p.preco && (
                              <span className="text-sm font-bold text-[#1B3A6B] shrink-0">
                                {formatarPreco(p.preco) ?? p.preco}
                              </span>
                            )}
                          </div>
                          {p.descricao && <p className="text-sm text-gray-500 mt-1">{p.descricao}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Promoções */}
              {fornecedor.promocoes.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">🏷️ Promoções ativas</h2>
                  <div className="space-y-4">
                    {fornecedor.promocoes.map((p) => (
                      <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        {p.imagem && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imagem} alt={p.titulo} className="w-full h-40 object-cover" />
                        )}
                        <div className="border-l-4 border-[#2E86AB] bg-blue-50 px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-gray-900">{p.titulo}</h3>
                            {p.valor && (
                              <span className="text-sm font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full shrink-0">
                                {formatarPreco(p.valor) ?? p.valor}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{p.descricao}</p>
                          {p.regras && (
                            <p className="text-xs text-gray-400 mt-2 italic border-t border-blue-100 pt-2">{p.regras}</p>
                          )}
                          {p.validade && (
                            <p className="text-xs text-gray-400 mt-2">
                              Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Endereços */}
              {enderecos.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">📍 Onde nos encontrar</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {enderecos.map((end) => (
                      <div key={end.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                        {end.nome && <p className="text-xs font-semibold text-[#2E86AB] uppercase tracking-wide mb-1">{end.nome}</p>}
                        <p className="text-sm text-gray-800">
                          {end.logradouro}{end.numero ? `, ${end.numero}` : ""}{end.complemento ? ` — ${end.complemento}` : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {[end.bairro, end.cidade, end.estado].filter(Boolean).join(", ")}
                          {end.cep ? ` · CEP ${end.cep}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Vídeo */}
              {fornecedor.video && (
                <section className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Vídeo institucional</h2>
                  <div className="relative pb-[56.25%] rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={fornecedor.video.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      title="Vídeo"
                    />
                  </div>
                </section>
              )}

              {/* Avaliações */}
              {(avaliacoes.length > 0 || avaliacoesAtivo) && (
                <section className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">⭐ Avaliações</h2>

                  {avaliacoes.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {avaliacoes.map((av) => (
                        <div key={av.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-400 text-sm leading-none">
                              {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                            </span>
                            <span className="font-semibold text-gray-800 text-sm">{av.nome}</span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(av.criadoEm).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{av.comentario}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {avaliacoesAtivo && (
                    <div className={avaliacoes.length > 0 ? "border-t border-gray-100 pt-5" : ""}>
                      <p className="text-sm font-semibold text-gray-700 mb-4">Deixe sua avaliação</p>
                      <AvaliacaoForm fornecedorId={fornecedor.id} />
                    </div>
                  )}
                </section>
              )}

              <div>
                <Link href="/fornecedores" className="text-[#2E86AB] hover:underline text-sm">
                  ← Voltar para todos os fornecedores
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide text-gray-400">Informações</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-400 text-xs mb-0.5">Categoria</dt>
                    <dd className="text-gray-700 font-medium">{fornecedor.categoria.nome}</dd>
                  </div>
                  {fornecedor.regioes.length > 0 && (
                    <div>
                      <dt className="text-gray-400 text-xs mb-0.5">Regiões atendidas</dt>
                      <dd className="text-gray-700">{fornecedor.regioes.join(", ")}</dd>
                    </div>
                  )}
                  {fornecedor.email && (
                    <div>
                      <dt className="text-gray-400 text-xs mb-0.5">E-mail</dt>
                      <dd>
                        <a href={`mailto:${fornecedor.email}`} className="text-[#2E86AB] hover:underline break-all">
                          {fornecedor.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {fornecedor.site && (
                    <div>
                      <dt className="text-gray-400 text-xs mb-0.5">Site</dt>
                      <dd>
                        <a href={fornecedor.site} target="_blank" rel="noopener noreferrer" className="text-[#2E86AB] hover:underline break-all">
                          {fornecedor.site.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {fornecedor.produtos.length === 0 && fornecedor.promocoes.length === 0 && (
                <div className="bg-[#1B3A6B] rounded-xl p-5 text-white text-center">
                  <p className="text-sm text-white/70 mb-3">Quer anunciar sua empresa aqui?</p>
                  <Link
                    href="/cadastro"
                    className="block bg-[#2E86AB] hover:bg-[#1d6a8a] px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Solicitar cadastro
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
