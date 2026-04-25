import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.nome || !data.slug || !data.descricao || !data.categoriaId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, slug, descricao, categoriaId" },
        { status: 400 }
      );
    }
    const fornecedor = await prisma.fornecedor.create({ data });
    return NextResponse.json(fornecedor);
  } catch {
    return NextResponse.json({ error: "Erro ao criar fornecedor" }, { status: 500 });
  }
}
