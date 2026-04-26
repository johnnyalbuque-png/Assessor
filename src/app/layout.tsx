import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Tracker from "@/components/Tracker";
import PopupBanner from "@/components/PopupBanner";
import { getConfigSite } from "@/lib/config-site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Vitrine ISP — O marketplace curado do mercado ISP",
  description:
    "Encontre fornecedores verificados para seu provedor de internet. Curadoria de quem mais conhece o mercado ISP no Brasil.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfigSite();

  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Tracker />
        {children}
        <PopupBanner
          ativo={config.popup_ativo === "1"}
          titulo={config.popup_titulo ?? ""}
          descricao={config.popup_descricao ?? ""}
          imagem={config.popup_imagem ?? ""}
          link={config.popup_link ?? ""}
          delay={parseInt(config.popup_delay ?? "2", 10)}
        />
      </body>
    </html>
  );
}
