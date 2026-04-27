import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; endId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { endId } = await params;
  const data = await req.json();
  if (!data.logradouro) return NextResponse.json({ error: "Logradouro é obrigatório" }, { status: 400 });
  if (!data.cidade) return NextResponse.json({ error: "Cidade é obrigatória" }, { status: 400 });
  if (!data.estado) return NextResponse.json({ error: "Estado é obrigatório" }, { status: 400 });
  const endereco = await prisma.endereco.update({
    where: { id: endId },
    data: {
      nome: data.nome || null,
      logradouro: data.logradouro,
      numero: data.numero || null,
      complemento: data.complemento || null,
      bairro: data.bairro || null,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep || null,
    },
  });
  return NextResponse.json(endereco);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string; endId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { endId } = await params;
  await prisma.endereco.delete({ where: { id: endId } });
  return NextResponse.json({ ok: true });
}
