import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteBannerBtn from "./[id]/DeleteBannerBtn";

export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  HORIZONTAL_TOPO: "Horizontal Topo",
  HORIZONTAL_RODAPE: "Horizontal Rodapé",
  VERTICAL_ESQUERDA: "Vertical Esquerda",
  VERTICAL_DIREITA: "Vertical Direita",
};

export default async function AdminBanners() {
  let banners: { id: string; tipo: string; titulo: string | null; imagem: string; link: string | null; ativo: boolean; ordem: number }[] = [];
  try {
    banners = await prisma.banner.findMany({ orderBy: [{ tipo: "asc" }, { ordem: "asc" }] });
  } catch { /* table may not exist yet */ }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <Link
          href="/admin/banners/novo"
          className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors"
        >
          + Novo banner
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Preview</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Posição</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Título</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Ordem</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {banners.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.imagem} alt="" className="h-12 w-24 object-cover rounded border border-gray-200" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{TIPO_LABEL[b.tipo] ?? b.tipo}</td>
                <td className="px-6 py-4 text-gray-500">{b.titulo ?? <span className="text-gray-300">—</span>}</td>
                <td className="px-6 py-4 text-gray-500">{b.ordem}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    b.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {b.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/banners/${b.id}`} className="text-[#2E86AB] hover:underline text-sm">
                      Editar
                    </Link>
                    <DeleteBannerBtn id={b.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {banners.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhum banner cadastrado.</div>
        )}
      </div>
    </div>
  );
}
