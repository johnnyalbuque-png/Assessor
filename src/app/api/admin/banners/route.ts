import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const banners = await prisma.banner.findMany({ orderBy: [{ tipo: "asc" }, { ordem: "asc" }] });
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: "Tabela de banners não existe. Acesse o Dashboard e clique em 'Manutenção do banco'." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
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
    revalidatePath("/");
    return NextResponse.json(banner);
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("does not exist")
      ? "Tabela de banners não existe. Acesse o Dashboard → Manutenção do banco."
      : "Erro ao criar banner";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
