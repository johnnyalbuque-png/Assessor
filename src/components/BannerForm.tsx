"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type TipoBanner = "HORIZONTAL_TOPO" | "HORIZONTAL_RODAPE" | "VERTICAL_ESQUERDA" | "VERTICAL_DIREITA";

type BannerData = {
  id?: string;
  tipo?: TipoBanner;
  titulo?: string | null;
  imagem?: string;
  link?: string | null;
  ativo?: boolean;
  ordem?: number;
};

const TIPOS: { value: TipoBanner; label: string; desc: string }[] = [
  { value: "HORIZONTAL_TOPO", label: "Horizontal — Topo", desc: "Faixa larga abaixo do cabeçalho (ex: 970×90)" },
  { value: "HORIZONTAL_RODAPE", label: "Horizontal — Rodapé", desc: "Faixa larga acima do rodapé (ex: 970×90)" },
  { value: "VERTICAL_ESQUERDA", label: "Vertical — Esquerda", desc: "Banner lateral esquerdo (ex: 160×600)" },
  { value: "VERTICAL_DIREITA", label: "Vertical — Direita", desc: "Banner lateral direito (ex: 160×600)" },
];

export default function BannerForm({ inicial }: { inicial?: BannerData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tipo, setTipo] = useState<TipoBanner>(inicial?.tipo ?? "HORIZONTAL_TOPO");
  const [ativo, setAtivo] = useState(inicial?.ativo ?? true);
  const [preview, setPreview] = useState(inicial?.imagem ?? "");
  const editando = !!inicial?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value;

    const payload = {
      tipo,
      titulo: getValue("titulo") || null,
      imagem: getValue("imagem"),
      link: getValue("link") || null,
      ativo,
      ordem: parseInt(getValue("ordem") || "0", 10),
    };

    const url = editando ? `/api/admin/banners/${inicial!.id}` : "/api/admin/banners";
    const method = editando ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao salvar");
        setLoading(false);
        return;
      }
    } catch {
      setErro("Erro de conexão");
      setLoading(false);
      return;
    }
    router.push("/admin/banners");
    router.refresh();
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 space-y-6 max-w-2xl">
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Posição do banner *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipo(t.value)}
              className={`text-left p-4 rounded-lg border-2 transition-colors ${
                tipo === t.value
                  ? "border-[#2E86AB] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{t.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Título (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
        <input name="titulo" defaultValue={inicial?.titulo ?? ""} className={field} placeholder="Identificador interno" />
      </div>

      {/* Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem *</label>
        <input
          name="imagem"
          defaultValue={inicial?.imagem ?? ""}
          required
          className={field}
          placeholder="https://..."
          onChange={(e) => setPreview(e.target.value)}
        />
        {preview && (
          <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full object-contain max-h-40" />
          </div>
        )}
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link de destino</label>
        <input name="link" defaultValue={inicial?.link ?? ""} className={field} placeholder="https://..." />
      </div>

      {/* Ordem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de exibição</label>
        <input name="ordem" type="number" defaultValue={inicial?.ordem ?? 0} className={`${field} w-28`} />
        <p className="text-xs text-gray-400 mt-1">Menor número aparece primeiro. Use quando houver múltiplos banners no mesmo local.</p>
      </div>

      {/* Ativo */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
          className="w-4 h-4 rounded accent-[#1B3A6B]"
        />
        <span className="text-sm text-gray-700">Banner ativo (visível no site)</span>
      </label>

      {erro && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{erro}</div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Salvando..." : editando ? "Salvar alterações" : "Criar banner"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
