import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  await prisma.solicitacao.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
