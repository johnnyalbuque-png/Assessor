import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const banners = await prisma.banner.findMany({ orderBy: [{ tipo: "asc" }, { ordem: "asc" }] });
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const data = await req.json();
  if (!data.tipo || !data.imagem) {
    return NextResponse.json({ error: "Tipo e imagem são obrigatórios" }, { status: 400 });
  }
  const banner = await prisma.banner.create({
    data: {
      tipo: data.tipo,
      titulo: data.titulo || null,
      imagem: data.imagem,
      link: data.link || null,
      ativo: data.ativo ?? true,
      ordem: data.ordem ?? 0,
    },
  });
  return NextResponse.json(banner);
}
