import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, path } = await req.json();
    if (!sessionId || !path) return NextResponse.json({ ok: false });

    // Log pageview only on initial load (not on heartbeats)
    const isHeartbeat = req.headers.get("x-heartbeat") === "1";
    if (!isHeartbeat) {
      await prisma.pageview.create({ data: { path } });
    }

    // Upsert active visitor
    await prisma.$executeRawUnsafe(
      `INSERT INTO "VisitaAtiva" ("id","sessionId","path","atualizadoEm")
       VALUES (gen_random_uuid()::text,$1,$2,now())
       ON CONFLICT ("sessionId") DO UPDATE SET "path"=$2,"atualizadoEm"=now()`,
      sessionId,
      path
    );
  } catch { /* non-critical */ }

  return NextResponse.json({ ok: true });
}
