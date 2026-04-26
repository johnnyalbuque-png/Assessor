import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getConfigSite } from "@/lib/config-site";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const config = await getConfigSite();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const data: Record<string, string> = await req.json();
  for (const [chave, valor] of Object.entries(data)) {
    await prisma.configSite.upsert({
      where: { chave },
      update: { valor: String(valor) },
      create: { chave, valor: String(valor) },
    });
  }
  revalidatePath("/");
  revalidatePath("/fornecedores");
  return NextResponse.json({ ok: true });
}
