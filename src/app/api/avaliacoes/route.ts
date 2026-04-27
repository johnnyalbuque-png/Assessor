import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { fornecedorId, nome, email, nota, comentario } = await req.json();

  if (!fornecedorId || !nome || !nota || !comentario) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }
  if (nota < 1 || nota > 5) {
    return NextResponse.json({ error: "Nota inválida" }, { status: 400 });
  }

  // Check supplier exists and has reviews enabled
  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id: fornecedorId, ativo: true },
    select: { id: true, avaliacoesAtivo: true },
  }).catch(() => null) as { id: string; avaliacoesAtivo?: boolean } | null;

  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });
  if (!fornecedor.avaliacoesAtivo) return NextResponse.json({ error: "Avaliações não habilitadas" }, { status: 403 });

  const avaliacao = await prisma.avaliacao.create({
    data: {
      fornecedorId,
      nome: nome.trim(),
      email: email?.trim() || null,
      nota: Number(nota),
      comentario: comentario.trim(),
    },
  });

  return NextResponse.json(avaliacao, { status: 201 });
}
