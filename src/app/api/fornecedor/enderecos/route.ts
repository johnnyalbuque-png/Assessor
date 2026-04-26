import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const enderecos = await prisma.endereco.findMany({
    where: { fornecedorId: conta.fornecedorId },
    orderBy: { criadoEm: "asc" },
  });
  return NextResponse.json(enderecos);
}

export async function POST(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome, logradouro, numero, complemento, bairro, cidade, estado, cep } = await req.json();
  if (!logradouro || !cidade || !estado) {
    return NextResponse.json({ error: "Logradouro, cidade e estado são obrigatórios" }, { status: 400 });
  }

  const endereco = await prisma.endereco.create({
    data: { fornecedorId: conta.fornecedorId, nome, logradouro, numero, complemento, bairro, cidade, estado, cep },
  });
  return NextResponse.json(endereco);
}
