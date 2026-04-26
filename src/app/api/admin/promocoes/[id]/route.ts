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
  const promocao = await prisma.promocao.update({
    where: { id },
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      validade: data.validade ? new Date(data.validade) : null,
      ativo: data.ativo ?? true,
    },
  });
  return NextResponse.json(promocao);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.promocao.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
