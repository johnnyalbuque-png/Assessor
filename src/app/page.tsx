import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { getConfigSite } from "@/lib/config-site";

export const revalidate = 60;

type Banner = { id: string; imagem: string; link: string | null; titulo: string | null };

async function getBanners(tipo: string): Promise<Banner[]> {
  try {
    return await prisma.banner.findMany({
      where: { tipo: tipo as never, ativo: true },
      orderBy: { ordem: "asc" },
      select: { id: true, imagem: true, link: true, titulo: true },
    });
  } catch {
    return [];
  }
}

function BannerImg({ b }: { b: Banner }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={b.imagem} alt={b.titulo ?? "Banner"} className="w-full h-full object-cover" />
  );
  if (b.link) return <a href={b.link} target="_blank" rel="noopener noreferrer">{img}</a>;
  return img;
}

async function getCoreData() {
  try {
    const [categorias, totalFornecedores, destaques] = await Promise.all([
      prisma.categoria.findMany({
        include: { _count: { select: { fornecedores: true } } },
        orderBy: { nome: "asc" },
      }),
      prisma.fornecedor.count({ where: { ativo: true } }),
      prisma.fornecedor.findMany({
        where: { ativo: true, recomendado: true },
        include: { categoria: true },
        take: 3,
      }),
    ]);
    return { categorias, totalFornecedores, destaques };
  } catch {
    return { categorias: [], totalFornecedores: 0, destaques: [] };
  }
}

export default async function Home() {
  const [{ categorias, totalFornecedores, destaques }, config, bannersHTop, bannersHRod, bannersVEsq, bannersVDir, bannersHero] =
    await Promise.all([
      getCoreData(),
      getConfigSite(),
      getBanners("HORIZONTAL_TOPO"),
      getBanners("HORIZONTAL_RODAPE"),
      getBanners("VERTICAL_ESQUERDA"),
      getBanners("VERTICAL_DIREITA"),
      getBanners("HERO"),
    ]);

  const hasVertical = bannersVEsq.length > 0 || bannersVDir.length > 0;
  const heroBanner = config.hero_modo === "banner" && bannersHero.length > 0;
  const showBtnFornecedores = config.hero_btn_fornecedores !== "0";
  const showBtnAnunciar = config.hero_btn_anunciar !== "0";

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        {heroBanner ? (
          <HeroCarousel banners={bannersHero} />
        ) : (
          <section className="bg-[#1B3A6B] text-white py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              {config.hero_badge && (
                <div className="inline-block bg-[#2E86AB]/20 text-[#7ec8e3] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                  {config.hero_badge}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                {config.hero_titulo}
              </h1>
              <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                {totalFornecedores} {config.hero_descricao}
              </p>
              {(showBtnFornecedores || showBtnAnunciar) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {showBtnFornecedores && (
                    <Link
                      href="/fornecedores"
                      className="bg-[#2E86AB] hover:bg-[#1d6a8a] px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Ver todos os fornecedores
                    </Link>
                  )}
                  {showBtnAnunciar && (
                    <Link
                      href="/cadastro"
                      className="border border-white/30 hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Quero anunciar minha empresa
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Banner horizontal topo */}
        {bannersHTop.length > 0 && (
          <div className="bg-gray-100 px-4 py-3">
            <div className="max-w-6xl mx-auto flex flex-col gap-3">
              {bannersHTop.map((b) => (
                <div key={b.id} className="w-full overflow-hidden rounded-lg max-h-24">
                  <BannerImg b={b} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo principal com sidebars opcionais */}
        <div className={`max-w-7xl mx-auto px-4 ${hasVertical ? "flex gap-6 items-start" : ""}`}>
          {/* Sidebar esquerda */}
          {bannersVEsq.length > 0 && (
            <aside className="hidden xl:flex flex-col gap-4 pt-16 w-40 shrink-0">
              {bannersVEsq.map((b) => (
                <div key={b.id} className="w-40 overflow-hidden rounded-lg">
                  <BannerImg b={b} />
                </div>
              ))}
            </aside>
          )}

          <div className="flex-1 min-w-0">
            {/* Categorias */}
            <section className="py-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-[#1B3A6B] mb-2">Categorias</h2>
                <p className="text-gray-500 mb-8">Busque por tipo de produto ou serviço</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categorias.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/fornecedores?categoria=${cat.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2E86AB]/30 transition-all text-center group"
                    >
                      <div className="text-3xl mb-2">{cat.icone}</div>
                      <div className="text-sm font-medium text-gray-700 group-hover:text-[#1B3A6B]">{cat.nome}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {cat._count.fornecedores} fornecedor{cat._count.fornecedores !== 1 ? "es" : ""}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Recomendados */}
            {destaques.length > 0 && (
              <section className="py-16 bg-white -mx-4 px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#1B3A6B]">Recomendados por Johnny</h2>
                    <span className="bg-[#2E86AB] text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      ✓ Curadoria INTER&apos;ISP
                    </span>
                  </div>
                  <p className="text-gray-500 mb-8">Empresas que conheço pessoalmente e indico</p>
                  <div className="grid md:grid-cols-3 gap-6">
                    {destaques.map((f) => (
                      <Link
                        key={f.id}
                        href={`/fornecedores/${f.slug}`}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs bg-[#1B3A6B] text-white px-2 py-0.5 rounded-full">
                            {f.categoria.nome}
                          </span>
                          <span className="text-xs text-[#2E86AB] font-semibold">★ Recomendado</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#1B3A6B]">
                          {f.nome}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">{f.descricao}</p>
                        <div className="mt-4 text-[#2E86AB] text-sm font-medium">Ver perfil →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA fornecedor */}
            <section className="py-16">
              <div className="max-w-3xl mx-auto bg-[#1B3A6B] rounded-2xl p-10 text-center text-white">
                <h2 className="text-2xl font-bold mb-3">Sua empresa fornece para provedores?</h2>
                <p className="text-white/70 mb-8">
                  Seja encontrado por +30.000 provedores de internet em todo o Brasil. Anuncie na Vitrine ISP.
                </p>
                <Link
                  href="/cadastro"
                  className="bg-[#2E86AB] hover:bg-[#1d6a8a] px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Solicitar cadastro
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar direita */}
          {bannersVDir.length > 0 && (
            <aside className="hidden xl:flex flex-col gap-4 pt-16 w-40 shrink-0">
              {bannersVDir.map((b) => (
                <div key={b.id} className="w-40 overflow-hidden rounded-lg">
                  <BannerImg b={b} />
                </div>
              ))}
            </aside>
          )}
        </div>

        {/* Banner horizontal rodapé */}
        {bannersHRod.length > 0 && (
          <div className="bg-gray-100 px-4 py-3">
            <div className="max-w-6xl mx-auto flex flex-col gap-3">
              {bannersHRod.map((b) => (
                <div key={b.id} className="w-full overflow-hidden rounded-lg max-h-24">
                  <BannerImg b={b} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
