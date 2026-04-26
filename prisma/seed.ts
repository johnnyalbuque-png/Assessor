import "dotenv/config";
import { PrismaClient, Plano } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categorias = [
    { nome: "Equipamentos", slug: "equipamentos", icone: "📡" },
    { nome: "Fibra Óptica e Infraestrutura", slug: "fibra-optica", icone: "🔌" },
    { nome: "Software de Gestão", slug: "software-gestao", icone: "💻" },
    { nome: "Monitoramento e NOC", slug: "monitoramento-noc", icone: "🖥️" },
    { nome: "Segurança e Firewall", slug: "seguranca-firewall", icone: "🔒" },
    { nome: "Energia", slug: "energia", icone: "⚡" },
    { nome: "Treinamento e Capacitação", slug: "treinamento", icone: "🎓" },
    { nome: "Jurídico e Regulatório", slug: "juridico", icone: "⚖️" },
    { nome: "Marketing para Provedores", slug: "marketing", icone: "📣" },
    { nome: "Financiamento e Crédito", slug: "financiamento", icone: "💰" },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const equipamentos = await prisma.categoria.findUnique({ where: { slug: "equipamentos" } });
  const software = await prisma.categoria.findUnique({ where: { slug: "software-gestao" } });

  if (equipamentos) {
    await prisma.fornecedor.upsert({
      where: { slug: "intelbras-telecom" },
      update: {},
      create: {
        nome: "Intelbras Telecom",
        slug: "intelbras-telecom",
        descricao: "Líder em equipamentos de redes para provedores de internet. OLTs, switches gerenciáveis, roteadores e soluções completas de FTTH para ISPs de todos os tamanhos.",
        plano: Plano.PREMIUM,
        ativo: true,
        recomendado: true,
        categoriaId: equipamentos.id,
        regioes: ["Sul", "Sudeste", "Centro-Oeste", "Norte", "Nordeste"],
        whatsapp: "48999990000",
        email: "comercial@intelbras.com.br",
        site: "https://www.intelbras.com.br",
      },
    });
  }

  if (software) {
    await prisma.fornecedor.upsert({
      where: { slug: "mk-solutions" },
      update: {},
      create: {
        nome: "MK Solutions",
        slug: "mk-solutions",
        descricao: "Sistema de gestão completo para provedores de internet. Billing, CRM, controle de contratos e integração com operadoras. Mais de 5.000 provedores utilizam nossa plataforma.",
        plano: Plano.DESTAQUE,
        ativo: true,
        recomendado: false,
        categoriaId: software.id,
        regioes: ["Sudeste", "Sul", "Centro-Oeste"],
        whatsapp: "11988880000",
        email: "vendas@mksolutions.com.br",
        site: "https://www.mksolutions.com.br",
      },
    });
  }

  console.log("✅ Seed concluído.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
