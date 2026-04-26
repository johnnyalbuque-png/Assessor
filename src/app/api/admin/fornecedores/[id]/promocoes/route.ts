import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const promocoes = await prisma.promocao.findMany({
    where: { fornecedorId: id },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(promocoes);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  if (!data.titulo || !data.descricao) {
    return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
  }
  const promocao = await prisma.promocao.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      validade: data.validade ? new Date(data.validade) : null,
      fornecedorId: id,
      ativo: data.ativo ?? true,
    },
  });
  return NextResponse.json(promocao);
}
