import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const data = await req.json();
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        tipo: data.tipo,
        titulo: data.titulo || null,
        imagem: data.imagem,
        link: data.link || null,
        ativo: data.ativo ?? true,
        ordem: data.ordem ?? 0,
      },
    });
    revalidatePath("/");
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir banner" }, { status: 500 });
  }
}
