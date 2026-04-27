import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id: conta.fornecedorId },
    select: { avaliacoesAtivo: true },
  }).catch(() => null) as { avaliacoesAtivo?: boolean } | null;

  const avaliacoes = await prisma.avaliacao.findMany({
    where: { fornecedorId: conta.fornecedorId },
    orderBy: { criadoEm: "desc" },
  }).catch(() => []);

  return NextResponse.json({
    avaliacoesAtivo: fornecedor?.avaliacoesAtivo ?? false,
    avaliacoes,
  });
}

export async function PUT(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { avaliacoesAtivo } = await req.json();
  await prisma.fornecedor.update({
    where: { id: conta.fornecedorId },
    data: { avaliacoesAtivo: Boolean(avaliacoesAtivo) },
  });

  return NextResponse.json({ ok: true });
}
