import { getConfigSite } from "@/lib/config-site";
import HeroConfigForm from "./HeroConfigForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HeroConfigPage() {
  const config = await getConfigSite();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração do Hero</h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle o visual e os textos da seção principal da home.
          </p>
        </div>
        <Link
          href="/admin/banners"
          className="text-sm text-[#2E86AB] hover:underline"
        >
          Gerenciar banners →
        </Link>
      </div>
      <HeroConfigForm config={config} />
    </div>
  );
}
