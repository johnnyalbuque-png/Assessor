import { NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const mensagens = await prisma.mensagemContato.findMany({
    where: { fornecedorId: conta.fornecedorId },
    orderBy: { criadoEm: "desc" },
  }).catch(() => []);

  return NextResponse.json(mensagens);
}
