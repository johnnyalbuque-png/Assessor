import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const produtos = await prisma.produto.findMany({
    where: { fornecedorId: conta.fornecedorId },
    orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }],
  });
  return NextResponse.json(produtos);
}

export async function POST(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome, descricao, preco, ordem } = await req.json();
  if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

  const produto = await prisma.produto.create({
    data: { nome, descricao, preco, ordem: ordem ?? 0, fornecedorId: conta.fornecedorId },
  });
  return NextResponse.json(produto);
}
