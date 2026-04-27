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
  const { lido } = await req.json();
  const msg = await prisma.mensagemContato.update({ where: { id }, data: { lido: Boolean(lido) } });
  return NextResponse.json(msg);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.mensagemContato.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
