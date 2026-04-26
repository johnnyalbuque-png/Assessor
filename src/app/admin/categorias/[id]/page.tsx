import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoriaForm from "@/components/CategoriaForm";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar: {categoria.nome}</h1>
      <CategoriaForm inicial={categoria} />
    </div>
  );
}
