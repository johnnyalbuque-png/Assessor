import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const { lido } = await req.json();

  // ensure the message belongs to this supplier
  const msg = await prisma.mensagemContato.findUnique({ where: { id }, select: { fornecedorId: true } });
  if (!msg || msg.fornecedorId !== conta.fornecedorId) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const updated = await prisma.mensagemContato.update({ where: { id }, data: { lido: Boolean(lido) } });
  return NextResponse.json(updated);
}
