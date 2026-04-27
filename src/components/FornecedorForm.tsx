"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

type Categoria = { id: string; nome: string };

type FornecedorData = {
  id?: string;
  nome?: string;
  slug?: string;
  tagline?: string | null;
  descricao?: string;
  logo?: string | null;
  banner?: string | null;
  plano?: string;
  ativo?: boolean;
  recomendado?: boolean;
  categoriaId?: string;
  regioes?: string[];
  whatsapp?: string | null;
  email?: string | null;
  site?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  video?: string | null;
};

const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function FornecedorForm({
  categorias,
  inicial,
}: {
  categorias: Categoria[];
  inicial?: FornecedorData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [regioes, setRegioes] = useState<string[]>(inicial?.regioes ?? []);
  const [slugValue, setSlugValue] = useState(inicial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!inicial?.id);
  const [logoUrl, setLogoUrl] = useState(inicial?.logo ?? "");
  const [bannerUrl, setBannerUrl] = useState(inicial?.banner ?? "");
  const editando = !!inicial?.id;

  function toggleRegiao(r: string) {
    setRegioes((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value || undefined;
    const getChecked = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.checked;

    const payload = {
      nome: getValue("nome"),
      slug: slugValue,
      tagline: getValue("tagline") || null,
      descricao: getValue("descricao"),
      logo: logoUrl || null,
      banner: bannerUrl || null,
      plano: getValue("plano"),
      ativo: getChecked("ativo"),
      recomendado: getChecked("recomendado"),
      categoriaId: getValue("categoriaId"),
      regioes,
      whatsapp: getValue("whatsapp"),
      email: getValue("email"),
      site: getValue("site"),
      instagram: getValue("instagram") || null,
      linkedin: getValue("linkedin") || null,
      video: getValue("video"),
    };

    const url = editando ? `/api/admin/fornecedores/${inicial!.id}` : "/api/admin/fornecedores";
    const method = editando ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    router.push("/admin/fornecedores");
    router.refresh();
  }

  const field =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da empresa *</label>
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
            name="slug"
            value={slugValue}
            required
            placeholder="ex: intelbras-telecom"
            className={field}
            onChange={(e) => {
              setSlugManual(true);
              setSlugValue(e.target.value);
            }}
          />
          <p className="text-xs text-gray-400 mt-1">/fornecedores/{slugValue || "..."}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (slogan)</label>
        <input name="tagline" defaultValue={inicial?.tagline ?? ""} placeholder="Ex: Líder em OLTs para provedores" className={field} />
        <p className="text-xs text-gray-400 mt-1">Frase curta exibida abaixo do nome no perfil</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <textarea
          name="descricao"
          defaultValue={inicial?.descricao}
          required
          rows={4}
          className={`${field} resize-none`}
        />
      </div>

      {/* Logo + Banner */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            tipo="logo"
            aspect="square"
            hint="Recomendado: 400×400 px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner (imagem de capa)</label>
          <ImageUpload
            value={bannerUrl}
            onChange={setBannerUrl}
            tipo="banner"
            aspect="wide"
            hint="Recomendado: 1200×400 px"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
          <select name="categoriaId" defaultValue={inicial?.categoriaId} required className={field}>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
          <select name="plano" defaultValue={inicial?.plano ?? "BASICO"} className={field}>
            <option value="BASICO">Básico — R$ 297/mês</option>
            <option value="DESTAQUE">Destaque — R$ 597/mês</option>
            <option value="PREMIUM">Premium — R$ 997/mês</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Regiões atendidas</label>
        <div className="flex flex-wrap gap-2">
          {REGIOES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRegiao(r)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                regioes.includes(r)
                  ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                  : "border-gray-200 text-gray-600 hover:border-[#2E86AB]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            name="whatsapp"
            defaultValue={inicial?.whatsapp ?? ""}
            placeholder="11999990000"
            className={field}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input name="email" type="email" defaultValue={inicial?.email ?? ""} className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
          <input name="site" defaultValue={inicial?.site ?? ""} placeholder="https://..." className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input name="instagram" defaultValue={inicial?.instagram ?? ""} placeholder="https://instagram.com/suaempresa" className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input name="linkedin" defaultValue={inicial?.linkedin ?? ""} placeholder="https://linkedin.com/company/..." className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vídeo (URL embed)</label>
          <input
            name="video"
            defaultValue={inicial?.video ?? ""}
            placeholder="https://youtube.com/embed/..."
            className={field}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            name="ativo"
            type="checkbox"
            defaultChecked={inicial?.ativo ?? true}
            className="w-4 h-4 accent-[#1B3A6B]"
          />
          Perfil ativo
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            name="recomendado"
            type="checkbox"
            defaultChecked={inicial?.recomendado ?? false}
            className="w-4 h-4 accent-[#2E86AB]"
          />
          Recomendado pela INTER&apos;ISP ★
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Salvando..." : editando ? "Salvar alterações" : "Criar fornecedor"}
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
