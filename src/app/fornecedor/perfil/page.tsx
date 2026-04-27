"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

type Perfil = {
  nome: string;
  tagline: string | null;
  descricao: string;
  whatsapp: string | null;
  email: string | null;
  site: string | null;
  instagram: string | null;
  linkedin: string | null;
  video: string | null;
  logo: string | null;
  banner: string | null;
  regioes: string[];
  mostrarWhatsapp?: boolean;
  mostrarEmail?: boolean;
  mostrarFormulario?: boolean;
};

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState<Partial<Perfil>>({});
  const [regioesStr, setRegioesStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    fetch("/api/fornecedor/perfil")
      .then((r) => r.json())
      .then((data) => {
        setPerfil(data);
        setForm(data);
        setRegioesStr((data.regioes ?? []).join(", "));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const regioes = regioesStr.split(",").map((r) => r.trim()).filter(Boolean);
      const res = await fetch("/api/fornecedor/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, regioes }),
      });
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Perfil salvo com sucesso!" });
      } else {
        const d = await res.json();
        setMsg({ tipo: "erro", texto: d.error || "Erro ao salvar" });
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão" });
    } finally {
      setSaving(false);
    }
  }

  function field(key: keyof Perfil) {
    return (String(form[key] ?? ""));
  }

  function set(key: keyof Perfil, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Carregando...</div>;
  if (!perfil) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.texto}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={field("tagline")} onChange={(e) => set("tagline", e.target.value)} placeholder="Slogan curto da empresa" />
          </div>
          <div>
            <label className="label">Regiões atendidas</label>
            <input className="input" value={regioesStr} onChange={(e) => setRegioesStr(e.target.value)} placeholder="SP, RJ, MG (separar por vírgula)" />
          </div>
        </div>

        <div>
          <label className="label">Descrição</label>
          <textarea
            className="input min-h-[120px] resize-y"
            value={field("descricao")}
            onChange={(e) => set("descricao", e.target.value)}
            placeholder="Descreva sua empresa..."
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="label">WhatsApp</label>
            <input className="input" value={field("whatsapp")} onChange={(e) => set("whatsapp", e.target.value)} placeholder="11999999999" />
          </div>
          <div>
            <label className="label">E-mail de contato</label>
            <input type="email" className="input" value={field("email")} onChange={(e) => set("email", e.target.value)} placeholder="contato@empresa.com" />
          </div>
          <div>
            <label className="label">Site</label>
            <input className="input" value={field("site")} onChange={(e) => set("site", e.target.value)} placeholder="https://empresa.com" />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input className="input" value={field("instagram")} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/suaempresa" />
          </div>
          <div>
            <label className="label">LinkedIn</label>
            <input className="input" value={field("linkedin")} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/..." />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Logo</label>
            <ImageUpload
              value={field("logo")}
              onChange={(url) => set("logo", url)}
              tipo="logo"
              aspect="square"
              hint="Recomendado: 400×400 px"
            />
          </div>
          <div>
            <label className="label">Banner (capa do perfil)</label>
            <ImageUpload
              value={field("banner")}
              onChange={(url) => set("banner", url)}
              tipo="banner"
              aspect="wide"
              hint="Recomendado: 1200×400 px"
            />
          </div>
        </div>

        <div>
          <label className="label">Vídeo (YouTube)</label>
          <input className="input" value={field("video")} onChange={(e) => set("video", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>

        {/* Opções de contato */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Opções de contato no perfil</p>
          {[
            { key: "mostrarWhatsapp" as const, label: "Mostrar botão WhatsApp 💬", defaultVal: true },
            { key: "mostrarEmail" as const, label: "Mostrar botão E-mail ✉️", defaultVal: true },
            { key: "mostrarFormulario" as const, label: "Mostrar formulário de contato 📩", defaultVal: false },
          ].map(({ key, label, defaultVal }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key] !== undefined ? Boolean(form[key]) : defaultVal}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                className="w-4 h-4 accent-[#1B3A6B]"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem; }
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; }
        .input:focus { border-color: #1B3A6B; box-shadow: 0 0 0 3px rgba(27,58,107,0.1); }
        .btn-primary { background: #1B3A6B; color: white; font-weight: 600; padding: 0.625rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; transition: background 0.15s; }
        .btn-primary:hover { background: #142d54; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
