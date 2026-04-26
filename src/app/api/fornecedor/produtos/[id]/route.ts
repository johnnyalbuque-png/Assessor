import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto || produto.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const { nome, descricao, preco, ativo, ordem } = await req.json();
  const atualizado = await prisma.produto.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(descricao !== undefined && { descricao }),
      ...(preco !== undefined && { preco }),
      ...(ativo !== undefined && { ativo }),
      ...(ordem !== undefined && { ordem }),
    },
  });
  return NextResponse.json(atualizado);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto || produto.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  await prisma.produto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
