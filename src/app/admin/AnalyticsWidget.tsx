"use client";
import { useEffect, useState, useCallback } from "react";

type Periodo = "hoje" | "semana" | "ano";
type Stats = { hoje: number; semana: number; ano: number; ativos: number };

export default function AnalyticsWidget() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>("hoje");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const periodos: { key: Periodo; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "semana", label: "7 dias" },
    { key: "ano", label: "Este ano" },
  ];

  const pageviews = stats ? stats[periodo] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800">Acessos ao site</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {periodos.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodo(p.key)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                periodo === p.key
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pageviews no período */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="text-3xl font-bold text-[#1B3A6B] mb-1">
            {pageviews === null ? "—" : pageviews.toLocaleString("pt-BR")}
          </div>
          <div className="text-sm text-gray-500">
            Pageviews{" "}
            {periodo === "hoje" ? "hoje" : periodo === "semana" ? "nos últimos 7 dias" : "neste ano"}
          </div>
        </div>

        {/* Visitantes simultâneos */}
        <div className="bg-[#1B3A6B] rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div className="text-3xl font-bold">
              {stats === null ? "—" : stats.ativos}
            </div>
          </div>
          <div className="text-sm text-white/70">Visitantes agora</div>
          <div className="text-xs text-white/40 mt-1">Atualiza a cada 15s</div>
        </div>
      </div>
    </div>
  );
}
