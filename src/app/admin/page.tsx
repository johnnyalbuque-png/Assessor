import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalFornecedores, ativos, solicitacoesPendentes, totalProvedores] = await Promise.all([
    prisma.fornecedor.count(),
    prisma.fornecedor.count({ where: { ativo: true } }),
    prisma.solicitacao.count({ where: { status: "PENDENTE" } }),
    prisma.provedor.count(),
  ]);

  const cards = [
    { label: "Fornecedores ativos", value: ativos, href: "/admin/fornecedores", cor: "bg-[#1B3A6B]" },
    { label: "Total cadastrado", value: totalFornecedores, href: "/admin/fornecedores", cor: "bg-[#2E86AB]" },
    { label: "Solicitações pendentes", value: solicitacoesPendentes, href: "/admin/solicitacoes", cor: "bg-amber-500" },
    { label: "Provedores cadastrados", value: totalProvedores, href: "#", cor: "bg-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`${c.cor} text-white rounded-xl p-6 hover:opacity-90 transition-opacity`}>
            <div className="text-3xl font-bold mb-1">{c.value}</div>
            <div className="text-sm text-white/80">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/fornecedores/novo" className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors">
            + Novo fornecedor
          </Link>
          <Link href="/admin/solicitacoes" className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Ver solicitações
          </Link>
          <Link href="/admin/fornecedores" className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Gerenciar fornecedores
          </Link>
        </div>
      </div>
    </div>
  );
}
