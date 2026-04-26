import { redirect } from "next/navigation";
import { getContaFromSession } from "@/lib/fornecedor-auth";
import FornecedorNav from "./FornecedorNav";

export default async function FornecedorLayout({ children }: { children: React.ReactNode }) {
  const conta = await getContaFromSession();
  if (!conta) redirect("/fornecedor/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <FornecedorNav nome={conta.fornecedor.nome} />
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
