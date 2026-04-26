import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("forn_session")?.value;
  if (token) {
    try {
      await prisma.contaFornecedor.update({
        where: { sessionToken: token },
        data: { sessionToken: null },
      });
    } catch { /* token might already be invalid */ }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("forn_session", "", { maxAge: 0, path: "/" });
  return res;
}
