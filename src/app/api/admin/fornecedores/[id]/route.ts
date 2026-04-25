import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const fornecedor = await prisma.fornecedor.update({ where: { id }, data });
  return NextResponse.json(fornecedor);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fornecedor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
