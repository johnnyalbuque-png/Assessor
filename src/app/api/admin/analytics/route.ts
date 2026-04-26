import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

  try {
    const [hoje, semana, ano, ativos] = await Promise.all([
      prisma.pageview.count({ where: { criadoEm: { gte: startOfDay } } }),
      prisma.pageview.count({ where: { criadoEm: { gte: startOfWeek } } }),
      prisma.pageview.count({ where: { criadoEm: { gte: startOfYear } } }),
      prisma.visitaAtiva.count({ where: { atualizadoEm: { gte: twoMinutesAgo } } }),
    ]);
    return NextResponse.json({ hoje, semana, ano, ativos });
  } catch {
    return NextResponse.json({ hoje: 0, semana: 0, ano: 0, ativos: 0 });
  }
}
