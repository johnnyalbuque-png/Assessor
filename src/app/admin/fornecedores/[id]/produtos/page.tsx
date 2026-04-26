import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProdutoForm from "./ProdutoForm";
import DeleteBtn from "./DeleteBtn";

export const dynamic = "force-dynamic";

export default async function AdminProdutos({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id },
    include: { produtos: { orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }] } },
  });
  if (!fornecedor) notFound();

  return (
    <div>
      <Link href={`/admin/fornecedores/${id}`} className="text-gray-400 hover:text-gray-600 text-sm mb-2 block">
        ← {fornecedor.nome}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Produtos e serviços</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Cadastrados ({fornecedor.produtos.length})</h2>
          {fornecedor.produtos.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {fornecedor.produtos.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${p.ativo ? "bg-green-400" : "bg-gray-300"}`} />
                      <span className="font-medium text-gray-900">{p.nome}</span>
                      {p.preco && <span className="text-xs text-[#1B3A6B] font-bold">{p.preco}</span>}
                    </div>
                    {p.descricao && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.descricao}</p>}
                  </div>
                  <DeleteBtn id={p.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Adicionar produto/serviço</h2>
          <ProdutoForm fornecedorId={id} />
        </div>
      </div>
    </div>
  );
}
