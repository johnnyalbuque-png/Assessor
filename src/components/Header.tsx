import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#1B3A6B] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Vitrine<span className="text-[#2E86AB]">ISP</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/fornecedores" className="hover:text-[#2E86AB] transition-colors">
            Fornecedores
          </Link>
          <Link href="/cadastro" className="bg-[#2E86AB] hover:bg-[#1d6a8a] px-4 py-2 rounded-lg font-medium transition-colors">
            Anuncie aqui
          </Link>
        </nav>
      </div>
    </header>
  );
}
