import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    await prisma.$executeRawUnsafe(`CREATE TYPE IF NOT EXISTS "Plano" AS ENUM ('BASICO', 'DESTAQUE', 'PREMIUM')`);
  } catch { /* already exists */ }

  try {
    await prisma.$executeRawUnsafe(`CREATE TYPE IF NOT EXISTS "StatusSolicitacao" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO')`);
  } catch { /* already exists */ }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Categoria" (
      "id" TEXT NOT NULL,
      "nome" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "icone" TEXT,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Categoria_slug_key" ON "Categoria"("slug")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Fornecedor" (
      "id" TEXT NOT NULL,
      "nome" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "descricao" TEXT NOT NULL,
      "logo" TEXT,
      "banner" TEXT,
      "plano" "Plano" NOT NULL DEFAULT 'BASICO',
      "ativo" BOOLEAN NOT NULL DEFAULT true,
      "recomendado" BOOLEAN NOT NULL DEFAULT false,
      "categoriaId" TEXT NOT NULL,
      "regioes" TEXT[],
      "whatsapp" TEXT,
      "email" TEXT,
      "site" TEXT,
      "video" TEXT,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Fornecedor_slug_key" ON "Fornecedor"("slug")
  `);

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_categoriaId_fkey"
      FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    `);
  } catch { /* already exists */ }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Provedor" (
      "id" TEXT NOT NULL,
      "nome" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "telefone" TEXT,
      "cidade" TEXT,
      "estado" TEXT,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Provedor_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Provedor_email_key" ON "Provedor"("email")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Solicitacao" (
      "id" TEXT NOT NULL,
      "empresa" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "telefone" TEXT,
      "mensagem" TEXT,
      "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Solicitacao_pkey" PRIMARY KEY ("id")
    )
  `);

  // Register migration as applied so prisma migrate deploy doesn't try to re-run it
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL,
        "checksum" VARCHAR(64) NOT NULL,
        "finished_at" TIMESTAMPTZ,
        "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMPTZ,
        "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
      VALUES (
        gen_random_uuid()::text,
        'setup-via-api',
        now(),
        '20260425211743_init',
        1
      )
      ON CONFLICT DO NOTHING
    `);
  } catch { /* ok */ }

  return NextResponse.json({ ok: true });
}
