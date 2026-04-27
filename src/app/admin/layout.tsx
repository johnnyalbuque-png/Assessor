import AdminNav from "./AdminNav";
import { getConfigSite } from "@/lib/config-site";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfigSite();
  return <AdminNav logoUrl={config.site_logo || undefined}>{children}</AdminNav>;
}
