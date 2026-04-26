import { prisma } from "@/lib/prisma";

export const CONFIG_DEFAULTS: Record<string, string> = {
  hero_modo: "cor",
  hero_badge: "Curadoria de quem esteve em +200 eventos ISP",
  hero_titulo: "Encontre o fornecedor certo para o seu provedor de internet",
  hero_descricao: "fornecedores verificados, organizados por categoria. Sem indicação aleatória — apenas empresas que passaram pela curadoria da INTER'ISP.",
  hero_btn_fornecedores: "1",
  hero_btn_anunciar: "1",
  hero_btns_no_header: "0",
};

export async function getConfigSite(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.configSite.findMany();
    const config = { ...CONFIG_DEFAULTS };
    for (const row of rows) config[row.chave] = row.valor;
    return config;
  } catch {
    return { ...CONFIG_DEFAULTS };
  }
}
