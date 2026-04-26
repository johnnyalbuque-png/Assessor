import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const promocao = await prisma.promocao.findUnique({ where: { id } });
  if (!promocao || promocao.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const { titulo, descricao, validade, ativo } = await req.json();
  const atualizada = await prisma.promocao.update({
    where: { id },
    data: {
      ...(titulo !== undefined && { titulo }),
      ...(descricao !== undefined && { descricao }),
      ...(validade !== undefined && { validade: validade ? new Date(validade) : null }),
      ...(ativo !== undefined && { ativo }),
    },
  });
  return NextResponse.json(atualizada);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const promocao = await prisma.promocao.findUnique({ where: { id } });
  if (!promocao || promocao.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  await prisma.promocao.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
