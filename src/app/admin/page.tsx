import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SeedButton from "./SeedButton";
import SetupDbButton from "./SetupDbButton";

async function getStats() {
  try {
    const [totalFornecedores, ativos, solicitacoesPendentes, totalProvedores, totalCategorias] =
      await Promise.all([
        prisma.fornecedor.count(),
        prisma.fornecedor.count({ where: { ativo: true } }),
        prisma.solicitacao.count({ where: { status: "PENDENTE" } }),
        prisma.provedor.count(),
        prisma.categoria.count(),
      ]);
    return { ok: true, totalFornecedores, ativos, solicitacoesPendentes, totalProvedores, totalCategorias };
  } catch {
    return { ok: false, totalFornecedores: 0, ativos: 0, solicitacoesPendentes: 0, totalProvedores: 0, totalCategorias: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  if (!stats.ok) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="font-semibold text-red-800 mb-1">Banco de dados não configurado</h2>
          <p className="text-red-700 text-sm mb-4">
            As tabelas ainda não foram criadas no banco de dados. Clique no botão abaixo para criá-las automaticamente.
          </p>
          <SetupDbButton />
        </div>
      </div>
    );
  }

  const { totalFornecedores, ativos, solicitacoesPendentes, totalProvedores, totalCategorias } = stats;

  const cards = [
    { label: "Fornecedores ativos", value: ativos, href: "/admin/fornecedores", cor: "bg-[#1B3A6B]" },
    { label: "Total cadastrado", value: totalFornecedores, href: "/admin/fornecedores", cor: "bg-[#2E86AB]" },
    { label: "Solicitações pendentes", value: solicitacoesPendentes, href: "/admin/solicitacoes", cor: "bg-amber-500" },
    { label: "Provedores cadastrados", value: totalProvedores, href: "/admin/provedores", cor: "bg-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`${c.cor} text-white rounded-xl p-6 hover:opacity-90 transition-opacity`}
          >
            <div className="text-3xl font-bold mb-1">{c.value}</div>
            <div className="text-sm text-white/80">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/fornecedores/novo"
            className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors"
          >
            + Novo fornecedor
          </Link>
          <Link
            href="/admin/solicitacoes"
            className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Ver solicitações
          </Link>
          <Link
            href="/admin/fornecedores"
            className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Gerenciar fornecedores
          </Link>
          <Link
            href="/admin/categorias"
            className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Gerenciar categorias
          </Link>
        </div>
      </div>

      {totalCategorias === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="font-semibold text-amber-800 mb-1">Banco de dados vazio</h2>
          <p className="text-amber-700 text-sm mb-4">
            Clique no botão abaixo para criar as 10 categorias e 2 fornecedores de exemplo.
            Faça isso apenas uma vez.
          </p>
          <SeedButton />
        </div>
      )}
    </div>
  );
}
