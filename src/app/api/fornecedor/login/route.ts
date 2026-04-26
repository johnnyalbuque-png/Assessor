import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verificarSenha } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  if (!email || !senha) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const conta = await prisma.contaFornecedor.findUnique({ where: { email } });
  if (!conta) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const ok = await verificarSenha(senha, conta.senhaHash);
  if (!ok) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  await prisma.contaFornecedor.update({ where: { id: conta.id }, data: { sessionToken: token } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("forn_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
