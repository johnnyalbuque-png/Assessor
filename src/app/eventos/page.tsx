import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getConfigSite } from "@/lib/config-site";

export const revalidate = 60;

export default async function EventosPage() {
  const config = await getConfigSite();
  if (config.eventos_ativo !== "1") notFound();

  const eventos = await prisma.evento.findMany({
    where: { ativo: true },
    orderBy: { data: "asc" },
  }).catch(() => []);

  const now = new Date();
  const proximos = eventos.filter((e) => new Date(e.data) >= now);
  const passados = eventos.filter((e) => new Date(e.data) < now).reverse();

  function EventoCard({ ev, dimmed }: { ev: typeof eventos[0]; dimmed?: boolean }) {
    const dataFormatada = new Date(ev.data).toLocaleDateString("pt-BR", {
      weekday: "short", day: "2-digit", month: "long", year: "numeric",
    });
    const horaFormatada = new Date(ev.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    return (
      <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all ${dimmed ? "opacity-60" : ""} ${ev.destaque ? "ring-2 ring-[#2E86AB]/30" : ""}`}>
        {ev.imagem && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ev.imagem} alt={ev.titulo} className="w-full h-44 object-cover" />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="bg-[#1B3A6B]/5 text-[#1B3A6B] text-xs font-semibold px-3 py-1.5 rounded-lg text-center min-w-[72px]">
              <div className="text-lg font-bold leading-tight">{new Date(ev.data).getDate()}</div>
              <div>{new Date(ev.data).toLocaleDateString("pt-BR", { month: "short" }).toUpperCase()}</div>
            </div>
            <div className="flex-1">
              {ev.destaque && (
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full mb-1 inline-block">★ Destaque</span>
              )}
              <h3 className="font-bold text-gray-900 text-base leading-snug">{ev.titulo}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">📅 {dataFormatada} às {horaFormatada}</p>
          {(ev.cidade || ev.local) && (
            <p className="text-xs text-gray-500 mb-3">📍 {[ev.cidade, ev.local].filter(Boolean).join(" · ")}</p>
          )}
          {ev.descricao && <p className="text-sm text-gray-600 line-clamp-3 mb-4">{ev.descricao}</p>}
          {ev.link && (
            <a
              href={ev.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2E86AB] hover:bg-[#1d6a8a] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Saiba mais →
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-[#1B3A6B] text-white py-14 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Eventos ISP</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Os principais eventos do setor de provedores de internet. Fique por dentro da agenda do mercado ISP.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
          {proximos.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Próximos eventos</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {proximos.map((ev) => <EventoCard key={ev.id} ev={ev} />)}
              </div>
            </section>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">📅</p>
              <p className="text-lg font-medium text-gray-500">Nenhum evento próximo</p>
              <p className="text-sm mt-1">Em breve novos eventos serão anunciados.</p>
            </div>
          )}

          {passados.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-500 mb-4">Eventos anteriores</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {passados.map((ev) => <EventoCard key={ev.id} ev={ev} dimmed />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
