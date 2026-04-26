import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const categoria = await prisma.categoria.update({
      where: { id },
      data: { nome: data.nome, slug: data.slug, icone: data.icone || null },
    });
    return NextResponse.json(categoria);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.categoria.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Não é possível excluir categoria com fornecedores vinculados" },
      { status: 400 }
    );
  }
}
