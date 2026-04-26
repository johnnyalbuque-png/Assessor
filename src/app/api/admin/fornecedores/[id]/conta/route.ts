import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashSenha } from "@/lib/auth";

async function verificarAdmin() {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true";
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verificarAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { email, senha } = await req.json();
  if (!email || !senha) return NextResponse.json({ error: "E-mail e senha obrigatórios" }, { status: 400 });

  const senhaHash = await hashSenha(senha);

  try {
    const conta = await prisma.contaFornecedor.upsert({
      where: { fornecedorId: id },
      create: { fornecedorId: id, email, senhaHash },
      update: { email, senhaHash },
    });
    return NextResponse.json({ ok: true, email: conta.email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro";
    if (msg.includes("Unique constraint") && msg.includes("email")) {
      return NextResponse.json({ error: "E-mail já está em uso por outra conta" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verificarAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.contaFornecedor.delete({ where: { fornecedorId: id } });
  } catch { /* might not exist */ }

  return NextResponse.json({ ok: true });
}
