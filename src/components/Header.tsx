import Link from "next/link";
import { getConfigSite } from "@/lib/config-site";

export default async function Header() {
  const config = await getConfigSite();
  const btnsNoHeader = config.hero_btns_no_header === "1";
  const eventosAtivo = config.eventos_ativo === "1";

  return (
    <header className="bg-[#1B3A6B] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Vitrine<span className="text-[#2E86AB]">ISP</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/promocoes" className="hover:text-[#2E86AB] transition-colors hidden sm:block">
            Promoções
          </Link>
          {eventosAtivo && (
            <Link href="/eventos" className="hover:text-[#2E86AB] transition-colors hidden sm:block">
              Eventos
            </Link>
          )}
          {btnsNoHeader ? (
            <>
              <Link href="/fornecedores" className="hidden md:block hover:text-[#2E86AB] transition-colors font-medium">
                Ver todos os fornecedores
              </Link>
              <Link
                href="/cadastro"
                className="bg-[#2E86AB] hover:bg-[#1d6a8a] px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Quero anunciar
              </Link>
            </>
          ) : (
            <>
              <Link href="/fornecedores" className="hover:text-[#2E86AB] transition-colors">
                Fornecedores
              </Link>
              <Link
                href="/cadastro"
                className="bg-[#2E86AB] hover:bg-[#1d6a8a] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Anuncie aqui
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
