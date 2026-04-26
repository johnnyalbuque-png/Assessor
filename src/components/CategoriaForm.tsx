"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoriaData = {
  id?: string;
  nome?: string;
  slug?: string;
  icone?: string | null;
};

const ICONES_SUGERIDOS = [
  "📡", "🔌", "💻", "🖥️", "🔒", "⚡", "🎓", "⚖️", "📣", "💰",
  "🏢", "📱", "🔧", "📦", "🌐", "🛡️", "📊", "🔗", "📶", "🖧",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function CategoriaForm({ inicial }: { inicial?: CategoriaData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [slugValue, setSlugValue] = useState(inicial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!inicial?.id);
  const [icone, setIcone] = useState(inicial?.icone ?? "🏢");
  const editando = !!inicial?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const form = e.currentTarget;
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;

    const url = editando ? `/api/admin/categorias/${inicial!.id}` : "/api/admin/categorias";
    const method = editando ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, slug: slugValue, icone }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao salvar categoria");
        setLoading(false);
        return;
      }
    } catch {
      setErro("Erro de conexão. Verifique sua internet.");
      setLoading(false);
      return;
    }
    router.push("/admin/categorias");
    router.refresh();
  }

  const field =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da categoria *</label>
        <input
          name="nome"
          defaultValue={inicial?.nome}
          required
          className={field}
          onChange={(e) => {
            if (!slugManual) setSlugValue(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
        <input
          value={slugValue}
          required
          className={field}
          onChange={(e) => {
            setSlugManual(true);
            setSlugValue(e.target.value);
          }}
        />
        <p className="text-xs text-gray-400 mt-1">
          /fornecedores?categoria=<span className="font-mono">{slugValue || "..."}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
        <div className="flex flex-wrap gap-1 mb-3">
          {ICONES_SUGERIDOS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcone(ic)}
              className={`text-2xl p-1.5 rounded-lg border-2 transition-colors ${
                icone === ic ? "border-[#2E86AB] bg-blue-50" : "border-transparent hover:border-gray-200"
              }`}
            >
              {ic}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl w-10 text-center">{icone}</span>
          <input
            value={icone}
            onChange={(e) => setIcone(e.target.value)}
            className={`${field} flex-1`}
            placeholder="Cole um emoji personalizado"
          />
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {erro}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Salvando..." : editando ? "Salvar alterações" : "Criar categoria"}
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
