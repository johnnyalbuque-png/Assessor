import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PLANO_COLOR: Record<string, string> = {
  BASICO: "bg-gray-100 text-gray-600",
  DESTAQUE: "bg-blue-100 text-blue-700",
  PREMIUM: "bg-yellow-100 text-yellow-700",
};

export default async function AdminFornecedores() {
  let fornecedores: { id: string; nome: string; recomendado: boolean; plano: string; ativo: boolean; categoria: { nome: string } }[] = [];
  let dbError = false;

  try {
    fornecedores = await prisma.fornecedor.findMany({
      include: { categoria: true },
      orderBy: [{ plano: "desc" }, { nome: "asc" }],
    });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
        <Link href="/admin/fornecedores/novo" className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors">
          + Novo fornecedor
        </Link>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-sm text-red-700">
          Erro ao carregar dados — o banco pode precisar de atualização.{" "}
          <Link href="/admin" className="underline font-medium">Ir ao Dashboard → Manutenção do banco</Link>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Nome</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Categoria</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Plano</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {fornecedores.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {f.nome}
                  {f.recomendado && <span className="ml-2 text-xs text-[#2E86AB]">★</span>}
                </td>
                <td className="px-6 py-4 text-gray-500">{f.categoria.nome}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${PLANO_COLOR[f.plano]}`}>{f.plano}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${f.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {f.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/fornecedores/${f.id}`} className="text-[#2E86AB] hover:underline text-sm">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fornecedores.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhum fornecedor cadastrado.</div>
        )}
      </div>
    </div>
  );
}
