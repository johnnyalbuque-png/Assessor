import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardFornecedor() {
  const conta = await getContaFromSession();
  if (!conta) redirect("/fornecedor/login");

  const fornecedorId = conta.fornecedorId;
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicioSemana = new Date(inicioHoje);
  inicioSemana.setDate(inicioHoje.getDate() - inicioHoje.getDay());
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [totalHoje, totalSemana, totalMes, porTipo, numProdutos, numPromocoes] = await Promise.all([
    prisma.leadClick.count({ where: { fornecedorId, criadoEm: { gte: inicioHoje } } }).catch(() => 0),
    prisma.leadClick.count({ where: { fornecedorId, criadoEm: { gte: inicioSemana } } }).catch(() => 0),
    prisma.leadClick.count({ where: { fornecedorId, criadoEm: { gte: inicioMes } } }).catch(() => 0),
    prisma.leadClick.groupBy({ by: ["tipo"], where: { fornecedorId }, _count: true }).catch(() => []),
    prisma.produto.count({ where: { fornecedorId, ativo: true } }).catch(() => 0),
    prisma.promocao.count({ where: { fornecedorId, ativo: true } }).catch(() => 0),
  ]);

  const leadMap = Object.fromEntries(porTipo.map((l) => [l.tipo, l._count]));

  const fornecedor = conta.fornecedor;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {fornecedor.nome} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Aqui está um resumo dos seus contatos e conteúdo.</p>
      </div>

      {/* Lead stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contatos recebidos</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Hoje", value: totalHoje },
            { label: "Esta semana", value: totalSemana },
            { label: "Este mês", value: totalMes },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <p className="text-3xl font-bold text-[#1B3A6B]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Por canal */}
      {totalMes > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Por canal (total)</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { tipo: "WHATSAPP", label: "WhatsApp", emoji: "💬" },
              { tipo: "EMAIL", label: "E-mail", emoji: "✉️" },
              { tipo: "SITE", label: "Site", emoji: "🌐" },
            ].map((c) => (
              <div key={c.tipo} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl mb-1">{c.emoji}</p>
                <p className="text-xl font-bold text-gray-900">{leadMap[c.tipo] ?? 0}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Seu conteúdo</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/fornecedor/produtos" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#2E86AB] transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#1B3A6B]">{numProdutos}</p>
                <p className="text-sm text-gray-600 mt-1">Produtos ativos</p>
              </div>
              <span className="text-3xl group-hover:scale-110 transition-transform">📦</span>
            </div>
          </Link>
          <Link href="/fornecedor/promocoes" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#2E86AB] transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#1B3A6B]">{numPromocoes}</p>
                <p className="text-sm text-gray-600 mt-1">Promoções ativas</p>
              </div>
              <span className="text-3xl group-hover:scale-110 transition-transform">🏷️</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Perfil público */}
      <div className="bg-[#1B3A6B] rounded-xl p-5 text-white flex items-center justify-between">
        <div>
          <p className="font-semibold">Ver perfil público</p>
          <p className="text-sm text-white/70">Como os clientes veem seu perfil na Vitrine ISP</p>
        </div>
        <a
          href={`/fornecedores/${fornecedor.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#1B3A6B] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0"
        >
          Abrir ↗
        </a>
      </div>
    </div>
  );
}
