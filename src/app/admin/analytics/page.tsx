import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = { id: string; nome: string; slug: string; total: bigint; ultimos30: bigint; hoje: bigint };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const fornecedores = await prisma.fornecedor.findMany({
    where: { ativo: true },
    select: { id: true, nome: true, slug: true },
    orderBy: { nome: "asc" },
  });

  const rows = await prisma.$queryRaw<Row[]>`
    SELECT
      f.id, f.nome, f.slug,
      COUNT(p.id)                                                                        AS total,
      COUNT(CASE WHEN p."criadoEm" >= NOW() - INTERVAL '30 days' THEN 1 END)            AS ultimos30,
      COUNT(CASE WHEN p."criadoEm" >= CURRENT_DATE THEN 1 END)                          AS hoje
    FROM "Fornecedor" f
    LEFT JOIN "Pageview" p ON p.path = '/fornecedores/' || f.slug
    WHERE f.ativo = true
    GROUP BY f.id, f.nome, f.slug
    ORDER BY total DESC
  `;

  const filtrado = q ? rows.filter((r) => r.nome.toLowerCase().includes(q.toLowerCase())) : rows;
  const totalGeral = rows.reduce((acc, r) => acc + Number(r.total), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitas por Fornecedor</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total de pageviews por perfil de fornecedor. Atualizado em tempo real.
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#1B3A6B]">{totalGeral.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-gray-400 mt-0.5">visitas totais</div>
        </div>
      </div>

      {/* Filtro */}
      <form className="mb-6">
        <div className="flex gap-3 max-w-sm">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar fornecedor..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
          />
          <button type="submit" className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors">
            Filtrar
          </button>
          {q && (
            <Link href="/admin/analytics" className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Limpar
            </Link>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Fornecedor</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-700">Hoje</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-700">Últimos 30 dias</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrado.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{r.nome}</td>
                <td className="px-6 py-4 text-right text-gray-600">{Number(r.hoje).toLocaleString("pt-BR")}</td>
                <td className="px-6 py-4 text-right text-gray-600">{Number(r.ultimos30).toLocaleString("pt-BR")}</td>
                <td className="px-6 py-4 text-right font-semibold text-[#1B3A6B]">{Number(r.total).toLocaleString("pt-BR")}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/fornecedores/${r.slug}`} target="_blank" className="text-[#2E86AB] hover:underline text-xs">
                    Ver perfil ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrado.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhum resultado encontrado.</div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Contabiliza apenas visitas à página <code>/fornecedores/[slug]</code> registradas no banco de dados.
      </p>
    </div>
  );
}
