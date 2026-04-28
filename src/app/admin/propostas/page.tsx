import { prisma } from "@/lib/prisma";
import PropostasClient from "./PropostasClient";

export const dynamic = "force-dynamic";

export default async function AdminPropostasPage() {
  const propostas = await prisma.solicitacaoProposta
    .findMany({ orderBy: { criadoEm: "desc" } })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitações de Proposta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Propostas recebidas pelo formulário público. Fornecedores Premium da região são notificados automaticamente.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {propostas.length} solicitaç{propostas.length === 1 ? "ão" : "ões"} registrada{propostas.length === 1 ? "" : "s"}
        </span>
      </div>

      <PropostasClient propostas={propostas} />
    </div>
  );
}
