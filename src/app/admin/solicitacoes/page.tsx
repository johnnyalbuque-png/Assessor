import { prisma } from "@/lib/prisma";
import AprovarBtn from "./AprovarBtn";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  APROVADO: "bg-green-100 text-green-700",
  REJEITADO: "bg-red-100 text-red-600",
};

export default async function Solicitacoes() {
  const solicitacoes = await prisma.solicitacao.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Solicitações de cadastro</h1>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Empresa</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">E-mail</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Telefone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Data</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {solicitacoes.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{s.empresa}</p>
                  {s.mensagem && (
                    <p className="text-xs text-gray-400 mt-1 max-w-xs truncate" title={s.mensagem}>
                      {s.mensagem}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">{s.email}</td>
                <td className="px-6 py-4 text-gray-500">{s.telefone ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(s.criadoEm).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-right">
                  {s.status === "PENDENTE" && <AprovarBtn id={s.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {solicitacoes.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhuma solicitação recebida.</div>
        )}
      </div>
    </div>
  );
}
