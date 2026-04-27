"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/fornecedor", label: "Dashboard", icon: "📊" },
  { href: "/fornecedor/perfil", label: "Perfil", icon: "✏️" },
  { href: "/fornecedor/enderecos", label: "Endereços", icon: "📍" },
  { href: "/fornecedor/produtos", label: "Produtos", icon: "📦" },
  { href: "/fornecedor/avaliacoes", label: "Avaliações", icon: "⭐" },
  { href: "/fornecedor/contatos", label: "Mensagens", icon: "📩" },
  { href: "/fornecedor/promocoes", label: "Promoções", icon: "🏷️" },
];

export default function FornecedorNav({ nome }: { nome: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/fornecedor/logout", { method: "POST" });
    router.push("/fornecedor/login");
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-bold text-[#1B3A6B] text-sm truncate max-w-[120px]">{nome}</span>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.href === "/fornecedor" ? pathname === "/fornecedor" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      active ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
