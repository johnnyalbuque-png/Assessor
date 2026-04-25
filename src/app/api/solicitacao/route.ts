import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { empresa, email, telefone, mensagem } = await req.json();
  if (!empresa || !email) return NextResponse.json({ error: "Dados obrigatórios" }, { status: 400 });
  await prisma.solicitacao.create({ data: { empresa, email, telefone, mensagem } });
  return NextResponse.json({ ok: true });
}
