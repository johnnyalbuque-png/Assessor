"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function PopupConfigForm({ config }: { config: Record<string, string> }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [erro, setErro] = useState("");

  const [ativo, setAtivo] = useState(config.popup_ativo === "1");
  const [titulo, setTitulo] = useState(config.popup_titulo ?? "");
  const [descricao, setDescricao] = useState(config.popup_descricao ?? "");
  const [imagem, setImagem] = useState(config.popup_imagem ?? "");
  const [link, setLink] = useState(config.popup_link ?? "");
  const [delay, setDelay] = useState(config.popup_delay ?? "2");

  async function handleSave() {
    setSaving(true);
    setErro("");
    setSaved(false);
    const res = await fetch("/api/admin/config-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        popup_ativo: ativo ? "1" : "0",
        popup_titulo: titulo,
        popup_descricao: descricao,
        popup_imagem: imagem,
        popup_link: link,
        popup_delay: delay,
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setErro("Erro ao salvar");
    }
    setSaving(false);
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Toggle principal */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Status do popup</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Quando ativo, aparece para todo visitante ao entrar no site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAtivo(!ativo)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              ativo ? "bg-[#2E86AB]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                ativo ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {ativo && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-800 font-medium">
            ✓ Popup ativado — aparecerá para visitantes após {delay}s
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={`bg-white rounded-xl border border-gray-100 p-6 space-y-4 transition-opacity ${!ativo ? "opacity-50 pointer-events-none select-none" : ""}`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-900">Conteúdo do popup</h2>
          {!ativo && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Popup inativo</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem (banner)</label>
          <ImageUpload value={imagem} onChange={setImagem} tipo="banner" aspect="wide" hint="Recomendado: 800×400 px" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={field}
            placeholder="Ex: Oferta especial para provedores!"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className={field}
            placeholder="Texto que aparece abaixo da imagem..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link de destino (opcional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={field}
            placeholder="https://..."
          />
          <p className="text-xs text-gray-400 mt-1">Ao clicar no popup, o visitante será redirecionado para este endereço.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Atraso antes de exibir</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              min="0"
              max="30"
              className={`${field} w-24`}
            />
            <span className="text-sm text-gray-500">segundos após abrir o site</span>
          </div>
        </div>
      </div>

      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar configurações"}
      </button>
    </div>
  );
}
