import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const promocoes = await prisma.promocao.findMany({
    where: { fornecedorId: conta.fornecedorId },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(promocoes);
}

export async function POST(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { titulo, descricao, validade } = await req.json();
  if (!titulo || !descricao) return NextResponse.json({ error: "Título e descrição obrigatórios" }, { status: 400 });

  const promocao = await prisma.promocao.create({
    data: {
      titulo,
      descricao,
      validade: validade ? new Date(validade) : null,
      fornecedorId: conta.fornecedorId,
    },
  });
  return NextResponse.json(promocao);
}
