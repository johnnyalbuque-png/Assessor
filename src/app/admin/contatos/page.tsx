import { prisma } from "@/lib/prisma";
import ContatosAdminClient from "./ContatosAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminContatosPage() {
  const [naoLidas, lidas] = await Promise.all([
    prisma.mensagemContato.findMany({
      where: { lido: false },
      include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
      orderBy: { criadoEm: "desc" },
    }).catch(() => []),
    prisma.mensagemContato.findMany({
      where: { lido: true },
      include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
      orderBy: { criadoEm: "desc" },
      take: 50,
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensagens de contato</h1>
        <p className="text-gray-500 text-sm mt-1">Mensagens enviadas por visitantes pelo formulário de contato dos perfis.</p>
      </div>
      <ContatosAdminClient naoLidas={naoLidas} lidas={lidas} />
    </div>
  );
}
