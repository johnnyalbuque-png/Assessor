import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { runMigrations } from "@/lib/migrate";

export async function POST() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  await runMigrations();
  return NextResponse.json({ ok: true });
}
