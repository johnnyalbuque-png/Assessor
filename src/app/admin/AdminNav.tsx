"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/fornecedores", label: "Fornecedores", icon: "🏢" },
  { href: "/admin/fornecedores/novo", label: "Novo fornecedor", icon: "➕" },
  { href: "/admin/categorias", label: "Categorias", icon: "🗂️" },
  { href: "/admin/banners", label: "Banners", icon: "🖼️" },
  { href: "/admin/hero", label: "Configurar Hero", icon: "🎯" },
  { href: "/admin/solicitacoes", label: "Solicitações", icon: "📬" },
  { href: "/admin/provedores", label: "Provedores", icon: "📡" },
];

export default function AdminNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-[#1B3A6B] text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="text-lg font-bold">
            Vitrine<span className="text-[#2E86AB]">ISP</span>
            <span className="text-xs text-white/50 ml-2 font-normal">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
          >
            🌐 Ver site
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white transition-colors">
              🚪 Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
