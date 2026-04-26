import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 60;

const PLANO_CONFIG = {
  PREMIUM: { label: "Premium", cor: "bg-amber-100 text-amber-700 border-amber-200" },
  DESTAQUE: { label: "Destaque", cor: "bg-blue-100 text-blue-700 border-blue-200" },
  BASICO: { label: "Básico", cor: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default async function PerfilFornecedor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { slug, ativo: true },
    include: {
      categoria: true,
      produtos: { where: { ativo: true }, orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }] },
      promocoes: { where: { ativo: true }, orderBy: { criadoEm: "desc" } },
    },
  });

  if (!fornecedor) notFound();

  const plano = PLANO_CONFIG[fornecedor.plano];

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Cover */}
        {fornecedor.banner ? (
          <div className="w-full h-48 md:h-64 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fornecedor.banner} alt={fornecedor.nome} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-36 bg-gradient-to-r from-[#1B3A6B] to-[#2E86AB]" />
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
              </div>

              {/* Botões de contato no topo */}
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                {fornecedor.whatsapp && (
                  <a
                    href={`https://wa.me/55${fornecedor.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
                {fornecedor.email && (
                  <a
                    href={`mailto:${fornecedor.email}`}
                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    ✉️ E-mail
                  </a>
                )}
                {fornecedor.site && (
                  <a
                    href={fornecedor.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    🌐 Site
                  </a>
                )}
              </div>
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
                      <div key={p.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-800">{p.nome}</h3>
                          {p.preco && (
                            <span className="text-sm font-bold text-[#1B3A6B] shrink-0">{p.preco}</span>
                          )}
                        </div>
                        {p.descricao && <p className="text-sm text-gray-500 mt-1">{p.descricao}</p>}
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
                      <div key={p.id} className="border-l-4 border-[#2E86AB] bg-blue-50 rounded-r-xl px-5 py-4">
                        <h3 className="font-semibold text-gray-900">{p.titulo}</h3>
                        <p className="text-sm text-gray-600 mt-1">{p.descricao}</p>
                        {p.validade && (
                          <p className="text-xs text-gray-400 mt-2">
                            Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}
                          </p>
                        )}
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
