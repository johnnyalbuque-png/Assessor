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
  const enderecos = await prisma.endereco.findMany({
    where: { fornecedorId: id },
    orderBy: { criadoEm: "asc" },
  });
  return NextResponse.json(enderecos);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  if (!data.logradouro) return NextResponse.json({ error: "Logradouro é obrigatório" }, { status: 400 });
  if (!data.cidade) return NextResponse.json({ error: "Cidade é obrigatória" }, { status: 400 });
  if (!data.estado) return NextResponse.json({ error: "Estado é obrigatório" }, { status: 400 });
  const endereco = await prisma.endereco.create({
    data: {
      fornecedorId: id,
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
