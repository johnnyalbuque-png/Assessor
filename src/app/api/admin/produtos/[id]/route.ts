import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const produto = await prisma.produto.update({
    where: { id },
    data: {
      nome: data.nome,
      descricao: data.descricao || null,
      preco: data.preco || null,
      ativo: data.ativo ?? true,
      ordem: data.ordem ?? 0,
    },
  });
  return NextResponse.json(produto);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.produto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
