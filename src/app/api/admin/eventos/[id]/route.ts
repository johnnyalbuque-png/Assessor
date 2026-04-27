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
  const evento = await prisma.evento.update({
    where: { id },
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      data: new Date(data.data),
      local: data.local || null,
      cidade: data.cidade || null,
      link: data.link || null,
      imagem: data.imagem || null,
      ativo: data.ativo ?? true,
      destaque: data.destaque ?? false,
    },
  });
  return NextResponse.json(evento);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.evento.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
