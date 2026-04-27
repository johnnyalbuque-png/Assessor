import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fornecedorId = searchParams.get("fornecedorId") ?? undefined;
  const lido = searchParams.get("lido");

  const mensagens = await prisma.mensagemContato.findMany({
    where: {
      ...(fornecedorId && { fornecedorId }),
      ...(lido !== null && { lido: lido === "true" }),
    },
    include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(mensagens);
}
