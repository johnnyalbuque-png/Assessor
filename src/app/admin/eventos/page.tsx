import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getConfigSite } from "@/lib/config-site";
import ToggleEventosBtn from "./ToggleEventosBtn";
import DeleteEventoBtn from "./[id]/DeleteEventoBtn";

export const dynamic = "force-dynamic";

export default async function AdminEventos() {
  const [config, eventos] = await Promise.all([
    getConfigSite(),
    prisma.evento.findMany({ orderBy: { data: "asc" } }).catch(() => []),
  ]);

  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os eventos do setor ISP exibidos no site.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleEventosBtn ativo={config.eventos_ativo === "1"} />
          <Link href="/admin/eventos/novo" className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors">
            + Novo evento
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Evento</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Data</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Local</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {eventos.map((ev) => {
              const passado = new Date(ev.data) < now;
              return (
                <tr key={ev.id} className={`hover:bg-gray-50 ${passado ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{ev.titulo}</div>
                    {ev.destaque && <span className="text-xs text-amber-600 font-medium">★ Destaque</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {new Date(ev.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    {passado && <span className="ml-2 text-xs text-gray-400">(passado)</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{[ev.cidade, ev.local].filter(Boolean).join(" · ") || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ev.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ev.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/eventos/${ev.id}`} className="text-[#2E86AB] hover:underline text-sm">Editar</Link>
                      <DeleteEventoBtn id={ev.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {eventos.length === 0 && (
          <div className="py-12 text-center text-gray-400">Nenhum evento cadastrado.</div>
        )}
      </div>
    </div>
  );
}
