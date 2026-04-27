import { prisma } from "@/lib/prisma";
import AvaliacaoModeracaoClient from "./AvaliacaoModeracaoClient";

export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const [pendentes, aprovadas, rejeitadas] = await Promise.all([
    prisma.avaliacao.findMany({
      where: { status: "PENDENTE" },
      include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
      orderBy: { criadoEm: "asc" },
    }).catch(() => []),
    prisma.avaliacao.findMany({
      where: { status: "APROVADO" },
      include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
      orderBy: { criadoEm: "desc" },
      take: 50,
    }).catch(() => []),
    prisma.avaliacao.findMany({
      where: { status: "REJEITADO" },
      include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
      orderBy: { criadoEm: "desc" },
      take: 30,
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
        <p className="text-gray-500 text-sm mt-1">Modere as avaliações submetidas pelos visitantes.</p>
      </div>
      <AvaliacaoModeracaoClient pendentes={pendentes} aprovadas={aprovadas} rejeitadas={rejeitadas} />
    </div>
  );
}
