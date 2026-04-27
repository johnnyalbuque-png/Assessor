import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXTAUTH_URL ?? "https://vitrineisp.com.br").replace(/\/$/, "");

  const fornecedores = await prisma.fornecedor.findMany({
    where: { ativo: true },
    select: { slug: true, atualizadoEm: true },
  }).catch(() => []);

  return [
    { url: base,                   lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/fornecedores`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/promocoes`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/eventos`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/cadastro`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...fornecedores.map((f) => ({
      url: `${base}/fornecedores/${f.slug}`,
      lastModified: f.atualizadoEm,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
