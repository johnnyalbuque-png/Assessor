import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FornecedorForm from "@/components/FornecedorForm";
import DeleteButton from "./DeleteButton";

export default async function EditarFornecedor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [fornecedor, categorias] = await Promise.all([
    prisma.fornecedor.findUnique({ where: { id } }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!fornecedor) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar: {fornecedor.nome}</h1>
        <DeleteButton id={fornecedor.id} />
      </div>
      <FornecedorForm categorias={categorias} inicial={fornecedor} />
    </div>
  );
}
