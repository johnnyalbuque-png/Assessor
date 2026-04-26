import { getConfigSite } from "@/lib/config-site";
import PopupConfigForm from "./PopupConfigForm";

export const dynamic = "force-dynamic";

export default async function PopupConfigPage() {
  const config = await getConfigSite();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Popup de entrada</h1>
        <p className="text-gray-500 text-sm mt-1">
          Exiba um anúncio ou mensagem assim que o visitante abrir o site. Cota de publicidade em destaque.
        </p>
      </div>
      <PopupConfigForm config={config} />
    </div>
  );
}
