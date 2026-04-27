import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } });
  return NextResponse.json(eventos);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const data = await req.json();
  if (!data.titulo || !data.data) return NextResponse.json({ error: "Título e data são obrigatórios" }, { status: 400 });
  const evento = await prisma.evento.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao || "",
      data: new Date(data.data),
      local: data.local || null,
      cidade: data.cidade || null,
      link: data.link || null,
      imagem: data.imagem || null,
      ativo: data.ativo ?? true,
      destaque: data.destaque ?? false,
    },
  });
  return NextResponse.json(evento);
}
