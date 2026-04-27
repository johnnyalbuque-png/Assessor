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
  const status = searchParams.get("status") ?? undefined;
  const fornecedorId = searchParams.get("fornecedorId") ?? undefined;

  const avaliacoes = await prisma.avaliacao.findMany({
    where: {
      ...(status && { status: status as "PENDENTE" | "APROVADO" | "REJEITADO" }),
      ...(fornecedorId && { fornecedorId }),
    },
    include: { fornecedor: { select: { id: true, nome: true, slug: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(avaliacoes);
}
