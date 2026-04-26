import { prisma } from "@/lib/prisma";
import FornecedorForm from "@/components/FornecedorForm";

export const dynamic = "force-dynamic";

export default async function NovoFornecedor() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo fornecedor</h1>
      <FornecedorForm categorias={categorias} />
    </div>
  );
}
