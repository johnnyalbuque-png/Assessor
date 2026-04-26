import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.nome || !data.slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
    }
    const categoria = await prisma.categoria.create({
      data: { nome: data.nome, slug: data.slug, icone: data.icone || null },
    });
    return NextResponse.json(categoria);
  } catch {
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
  }
}
