export function formatarPreco(valor: string | null | undefined): string | null {
  if (!valor?.trim()) return null;
  const v = valor.trim();
  if (/^R\$/i.test(v)) return "R$ " + v.replace(/^R\$\s*/i, "");
  const num = parseFloat(v.replace(/\./g, "").replace(",", "."));
  if (!isNaN(num)) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  }
  return v;
}
