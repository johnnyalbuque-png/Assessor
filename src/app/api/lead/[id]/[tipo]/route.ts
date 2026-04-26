import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TIPOS_VALIDOS = ["WHATSAPP", "EMAIL", "SITE"] as const;
type TipoLead = (typeof TIPOS_VALIDOS)[number];

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; tipo: string }> }
) {
  const { id, tipo } = await params;
  const tipoUpper = tipo.toUpperCase() as TipoLead;

  if (!TIPOS_VALIDOS.includes(tipoUpper)) {
    return NextResponse.json({ ok: false });
  }

  try {
    await prisma.leadClick.create({
      data: { fornecedorId: id, tipo: tipoUpper },
    });
  } catch { /* non-critical — table might not exist yet */ }

  return NextResponse.json({ ok: true });
}
