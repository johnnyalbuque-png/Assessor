import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", "true", { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return res;
  }
  return NextResponse.json({ error: "Inválido" }, { status: 401 });
}
