import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function PerfilFornecedor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fornecedor = await prisma.fornecedor.findUnique({
    where: { slug, ativo: true },
    include: { categoria: true },
  });

  if (!fornecedor) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <div className="bg-[#1B3A6B] h-32" />

        <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                {fornecedor.categoria.icone ?? "🏢"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm bg-[#1B3A6B] text-white px-2.5 py-0.5 rounded-full">
                    {fornecedor.categoria.nome}
                  </span>
                  {fornecedor.recomendado && (
                    <span className="text-sm bg-[#2E86AB] text-white px-2.5 py-0.5 rounded-full font-medium">
                      ★ Recomendado por Johnny
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{fornecedor.nome}</h1>
                <p className="text-gray-600 leading-relaxed">{fornecedor.descricao}</p>
              </div>
            </div>

            {/* Regiões */}
            {fornecedor.regioes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-medium">Regiões atendidas</p>
                <div className="flex flex-wrap gap-2">
                  {fornecedor.regioes.map((r) => (
                    <span key={r} className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Entre em contato</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {fornecedor.whatsapp && (
                <a
                  href={`https://wa.me/55${fornecedor.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-xl hover:bg-green-100 transition-colors font-medium"
                >
                  <span className="text-xl">📱</span>
                  <span>WhatsApp</span>
                </a>
              )}
              {fornecedor.email && (
                <a
                  href={`mailto:${fornecedor.email}`}
                  className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  <span className="text-xl">✉️</span>
                  <span>E-mail</span>
                </a>
              )}
              {fornecedor.site && (
                <a
                  href={fornecedor.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  <span className="text-xl">🌐</span>
                  <span>Site</span>
                </a>
              )}
            </div>
          </div>

          {/* Vídeo */}
          {fornecedor.video && (
            <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Vídeo institucional</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={fornecedor.video}
                  className="w-full h-full"
                  allowFullScreen
                  title={`Vídeo ${fornecedor.nome}`}
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/fornecedores" className="text-[#2E86AB] hover:underline text-sm">
              ← Voltar para fornecedores
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
