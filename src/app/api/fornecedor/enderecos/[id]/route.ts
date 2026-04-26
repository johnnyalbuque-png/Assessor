import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const end = await prisma.endereco.findUnique({ where: { id } });
  if (!end || end.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const { nome, logradouro, numero, complemento, bairro, cidade, estado, cep } = await req.json();
  const atualizado = await prisma.endereco.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(logradouro !== undefined && { logradouro }),
      ...(numero !== undefined && { numero }),
      ...(complemento !== undefined && { complemento }),
      ...(bairro !== undefined && { bairro }),
      ...(cidade !== undefined && { cidade }),
      ...(estado !== undefined && { estado }),
      ...(cep !== undefined && { cep }),
    },
  });
  return NextResponse.json(atualizado);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const end = await prisma.endereco.findUnique({ where: { id } });
  if (!end || end.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  await prisma.endereco.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
