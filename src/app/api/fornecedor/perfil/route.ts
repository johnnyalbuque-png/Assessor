import { NextRequest, NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return NextResponse.json(conta.fornecedor);
}

export async function PUT(req: NextRequest) {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { tagline, descricao, whatsapp, email, site, instagram, linkedin, video, logo, banner, regioes, mostrarWhatsapp, mostrarEmail, mostrarFormulario } = await req.json();

  const fornecedor = await prisma.fornecedor.update({
    where: { id: conta.fornecedorId },
    data: {
      ...(tagline !== undefined && { tagline }),
      ...(descricao !== undefined && { descricao }),
      ...(whatsapp !== undefined && { whatsapp }),
      ...(email !== undefined && { email }),
      ...(site !== undefined && { site }),
      ...(instagram !== undefined && { instagram }),
      ...(linkedin !== undefined && { linkedin }),
      ...(video !== undefined && { video }),
      ...(logo !== undefined && { logo }),
      ...(banner !== undefined && { banner }),
      ...(regioes !== undefined && { regioes }),
      ...(mostrarWhatsapp !== undefined && { mostrarWhatsapp }),
      ...(mostrarEmail !== undefined && { mostrarEmail }),
      ...(mostrarFormulario !== undefined && { mostrarFormulario }),
    },
  });

  return NextResponse.json(fornecedor);
}
