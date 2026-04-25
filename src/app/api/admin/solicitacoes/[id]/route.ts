import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_VALIDOS = ["PENDENTE", "APROVADO", "REJEITADO"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!STATUS_VALIDOS.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }
    await prisma.solicitacao.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar solicitação" }, { status: 500 });
  }
}
