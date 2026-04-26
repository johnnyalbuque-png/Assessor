import { prisma } from "@/lib/prisma";

export default async function AdminProvedores() {
  const provedores = await prisma.provedor.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provedores cadastrados</h1>
          <p className="text-gray-500 text-sm mt-1">{provedores.length} provedor{provedores.length !== 1 ? "es" : ""} registrado{provedores.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Nome</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">E-mail</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Cidade / Estado</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Telefone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {provedores.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                <td className="px-6 py-4 text-gray-500">{p.email}</td>
                <td className="px-6 py-4 text-gray-500">
                  {[p.cidade, p.estado].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-6 py-4 text-gray-500">{p.telefone ?? "—"}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {provedores.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p>Nenhum provedor cadastrado ainda.</p>
            <p className="text-xs mt-2">Provedores se cadastram pela página pública de acesso gratuito.</p>
          </div>
        )}
      </div>
    </div>
  );
}
