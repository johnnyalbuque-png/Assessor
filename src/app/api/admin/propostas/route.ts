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
  const estado = searchParams.get("estado") ?? undefined;

  const propostas = await prisma.solicitacaoProposta.findMany({
    where: estado ? { estado } : undefined,
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(propostas);
}
