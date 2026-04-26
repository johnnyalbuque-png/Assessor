import { NextResponse } from "next/server";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conta = await getContaFromSession();
  if (!conta) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicioSemana = new Date(inicioHoje);
  inicioSemana.setDate(inicioHoje.getDate() - inicioHoje.getDay());
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [totalHoje, totalSemana, totalMes, porTipo] = await Promise.all([
    prisma.leadClick.count({ where: { fornecedorId: conta.fornecedorId, criadoEm: { gte: inicioHoje } } }),
    prisma.leadClick.count({ where: { fornecedorId: conta.fornecedorId, criadoEm: { gte: inicioSemana } } }),
    prisma.leadClick.count({ where: { fornecedorId: conta.fornecedorId, criadoEm: { gte: inicioMes } } }),
    prisma.leadClick.groupBy({
      by: ["tipo"],
      where: { fornecedorId: conta.fornecedorId },
      _count: true,
    }),
  ]);

  return NextResponse.json({ totalHoje, totalSemana, totalMes, porTipo });
}
