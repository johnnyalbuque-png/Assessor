import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Enums
  for (const sql of [
    `DO $$ BEGIN CREATE TYPE "Plano" AS ENUM ('BASICO', 'DESTAQUE', 'PREMIUM'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "TipoBanner" AS ENUM ('HORIZONTAL_TOPO', 'HORIZONTAL_RODAPE', 'VERTICAL_ESQUERDA', 'VERTICAL_DIREITA'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "TipoLead" AS ENUM ('WHATSAPP', 'EMAIL', 'SITE'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
  ]) {
    await prisma.$executeRawUnsafe(sql);
  }

  // Core tables
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Categoria" (
      "id" TEXT NOT NULL, "nome" TEXT NOT NULL, "slug" TEXT NOT NULL,
      "icone" TEXT, "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Categoria_slug_key" ON "Categoria"("slug")`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Fornecedor" (
      "id" TEXT NOT NULL, "nome" TEXT NOT NULL, "slug" TEXT NOT NULL,
      "tagline" TEXT, "descricao" TEXT NOT NULL,
      "logo" TEXT, "banner" TEXT,
      "plano" "Plano" NOT NULL DEFAULT 'BASICO',
      "ativo" BOOLEAN NOT NULL DEFAULT true, "recomendado" BOOLEAN NOT NULL DEFAULT false,
      "categoriaId" TEXT NOT NULL, "regioes" TEXT[],
      "whatsapp" TEXT, "email" TEXT, "site" TEXT, "video" TEXT,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Fornecedor_slug_key" ON "Fornecedor"("slug")`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_categoriaId_fkey"
    FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$
  `);

  // Add tagline column if upgrading from old schema
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "Fornecedor" ADD COLUMN "tagline" TEXT;
    EXCEPTION WHEN duplicate_column THEN null; END $$
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Produto" (
      "id" TEXT NOT NULL, "nome" TEXT NOT NULL, "descricao" TEXT,
      "preco" TEXT, "fornecedorId" TEXT NOT NULL,
      "ativo" BOOLEAN NOT NULL DEFAULT true, "ordem" INT NOT NULL DEFAULT 0,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "Produto" ADD CONSTRAINT "Produto_fornecedorId_fkey"
    FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Promocao" (
      "id" TEXT NOT NULL, "titulo" TEXT NOT NULL, "descricao" TEXT NOT NULL,
      "validade" TIMESTAMP(3), "fornecedorId" TEXT NOT NULL,
      "ativo" BOOLEAN NOT NULL DEFAULT true,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Promocao_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "Promocao" ADD CONSTRAINT "Promocao_fornecedorId_fkey"
    FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Banner" (
      "id" TEXT NOT NULL, "tipo" "TipoBanner" NOT NULL,
      "titulo" TEXT, "imagem" TEXT NOT NULL, "link" TEXT,
      "ativo" BOOLEAN NOT NULL DEFAULT true, "ordem" INT NOT NULL DEFAULT 0,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Pageview" (
      "id" TEXT NOT NULL, "path" TEXT NOT NULL,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Pageview_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Pageview_criadoEm_idx" ON "Pageview"("criadoEm")`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "VisitaAtiva" (
      "id" TEXT NOT NULL, "sessionId" TEXT NOT NULL, "path" TEXT NOT NULL,
      "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "VisitaAtiva_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "VisitaAtiva_sessionId_key" ON "VisitaAtiva"("sessionId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "VisitaAtiva_atualizadoEm_idx" ON "VisitaAtiva"("atualizadoEm")`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Provedor" (
      "id" TEXT NOT NULL, "nome" TEXT NOT NULL, "email" TEXT NOT NULL,
      "telefone" TEXT, "cidade" TEXT, "estado" TEXT,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Provedor_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Provedor_email_key" ON "Provedor"("email")`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Solicitacao" (
      "id" TEXT NOT NULL, "empresa" TEXT NOT NULL, "email" TEXT NOT NULL,
      "telefone" TEXT, "mensagem" TEXT,
      "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Solicitacao_pkey" PRIMARY KEY ("id")
    )
  `);

  // ContaFornecedor
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ContaFornecedor" (
      "id" TEXT NOT NULL, "fornecedorId" TEXT NOT NULL,
      "email" TEXT NOT NULL, "senhaHash" TEXT NOT NULL,
      "sessionToken" TEXT, "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ContaFornecedor_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ContaFornecedor_fornecedorId_key" ON "ContaFornecedor"("fornecedorId")`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ContaFornecedor_email_key" ON "ContaFornecedor"("email")`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ContaFornecedor_sessionToken_key" ON "ContaFornecedor"("sessionToken")`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "ContaFornecedor" ADD CONSTRAINT "ContaFornecedor_fornecedorId_fkey"
    FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$
  `);

  // LeadClick
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LeadClick" (
      "id" TEXT NOT NULL, "fornecedorId" TEXT NOT NULL,
      "tipo" "TipoLead" NOT NULL,
      "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LeadClick_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "LeadClick_fornecedorId_criadoEm_idx" ON "LeadClick"("fornecedorId","criadoEm")`);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN ALTER TABLE "LeadClick" ADD CONSTRAINT "LeadClick_fornecedorId_fkey"
    FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$
  `);

  // Prisma migrations table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL, "checksum" VARCHAR(64) NOT NULL,
        "finished_at" TIMESTAMPTZ, "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT, "rolled_back_at" TIMESTAMPTZ,
        "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" ("id","checksum","finished_at","migration_name","applied_steps_count")
      VALUES (gen_random_uuid()::text,'setup-via-api-v2',now(),'20260425211743_init',1)
      ON CONFLICT DO NOTHING
    `);
  } catch { /* ok */ }

  return NextResponse.json({ ok: true });
}
