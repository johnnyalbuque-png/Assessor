import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FornecedorForm from "@/components/FornecedorForm";
import DeleteButton from "./DeleteButton";
import ContaSection from "./ContaSection";

export const dynamic = "force-dynamic";

export default async function EditarFornecedor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [fornecedor, categorias] = await Promise.all([
    prisma.fornecedor.findUnique({
      where: { id },
      include: { _count: { select: { produtos: true, promocoes: true, enderecos: true } } },
    }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!fornecedor) notFound();

  const conta = await prisma.contaFornecedor.findUnique({ where: { fornecedorId: id } }).catch(() => null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar: {fornecedor.nome}</h1>
        <DeleteButton id={fornecedor.id} />
      </div>

      {/* Links para produtos e promoções */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/fornecedores/${id}/produtos`}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          📦 Produtos/Serviços
          <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
            {fornecedor._count.produtos}
          </span>
        </Link>
        <Link
          href={`/admin/fornecedores/${id}/promocoes`}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          🏷️ Promoções
          <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
            {fornecedor._count.promocoes}
          </span>
        </Link>
        <Link
          href={`/admin/fornecedores/${id}/enderecos`}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          📍 Endereços
          <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
            {fornecedor._count.enderecos}
          </span>
        </Link>
        <Link
          href={`/fornecedores/${fornecedor.slug}`}
          target="_blank"
          className="flex items-center gap-2 border border-[#2E86AB]/30 text-[#2E86AB] px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
        >
          🌐 Ver perfil público
        </Link>
      </div>

      <FornecedorForm categorias={categorias} inicial={fornecedor} />

      <ContaSection fornecedorId={fornecedor.id} emailAtual={conta?.email} />
    </div>
  );
}
