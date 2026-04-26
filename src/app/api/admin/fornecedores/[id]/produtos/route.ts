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
  const produtos = await prisma.produto.findMany({
    where: { fornecedorId: id },
    orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }],
  });
  return NextResponse.json(produtos);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  if (!data.nome) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  const produto = await prisma.produto.create({
    data: {
      nome: data.nome,
      descricao: data.descricao || null,
      preco: data.preco || null,
      imagem: data.imagem || null,
      fornecedorId: id,
      ativo: data.ativo ?? true,
      ordem: data.ordem ?? 0,
    },
  });
  return NextResponse.json(produto);
}
