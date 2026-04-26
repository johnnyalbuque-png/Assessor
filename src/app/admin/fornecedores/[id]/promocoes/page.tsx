import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PromocaoForm from "./PromocaoForm";
import DeleteBtn from "./DeleteBtn";

export default async function AdminPromocoes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id },
    include: { promocoes: { orderBy: { criadoEm: "desc" } } },
  });
  if (!fornecedor) notFound();

  return (
    <div>
      <Link href={`/admin/fornecedores/${id}`} className="text-gray-400 hover:text-gray-600 text-sm mb-2 block">
        ← {fornecedor.nome}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Promoções</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Cadastradas ({fornecedor.promocoes.length})</h2>
          {fornecedor.promocoes.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhuma promoção cadastrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {fornecedor.promocoes.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${p.ativo ? "bg-green-400" : "bg-gray-300"}`} />
                        <span className="font-medium text-gray-900">{p.titulo}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.descricao}</p>
                      {p.validade && (
                        <p className="text-xs text-gray-400 mt-1">
                          Válido até {new Date(p.validade).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <DeleteBtn id={p.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Adicionar promoção</h2>
          <PromocaoForm fornecedorId={id} />
        </div>
      </div>
    </div>
  );
}
