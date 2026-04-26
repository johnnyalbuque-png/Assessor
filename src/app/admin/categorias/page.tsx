import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCategoriaBtn from "./[id]/DeleteCategoriaBtn";

export default async function AdminCategorias() {
  const categorias = await prisma.categoria.findMany({
    include: { _count: { select: { fornecedores: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <Link
          href="/admin/categorias/novo"
          className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors"
        >
          + Nova categoria
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 w-16">Ícone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Nome</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Slug</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Fornecedores</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categorias.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-2xl">{c.icone ?? "—"}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{c.nome}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-6 py-4 text-gray-500">{c._count.fornecedores}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categorias/${c.id}`}
                      className="text-[#2E86AB] hover:underline text-sm"
                    >
                      Editar
                    </Link>
                    {c._count.fornecedores === 0 && <DeleteCategoriaBtn id={c.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categorias.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhuma categoria cadastrada.</div>
        )}
      </div>
    </div>
  );
}
