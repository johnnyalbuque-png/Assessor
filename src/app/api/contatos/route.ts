import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { fornecedorId, nome, email, mensagem } = await req.json();

  if (!fornecedorId || !nome || !email || !mensagem) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id: fornecedorId, ativo: true },
    select: { id: true, mostrarFormulario: true },
  }).catch(() => null) as { id: string; mostrarFormulario?: boolean } | null;

  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });
  if (!fornecedor.mostrarFormulario) return NextResponse.json({ error: "Formulário não habilitado" }, { status: 403 });

  await prisma.mensagemContato.create({
    data: {
      fornecedorId,
      nome: nome.trim(),
      email: email.trim(),
      mensagem: mensagem.trim(),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
