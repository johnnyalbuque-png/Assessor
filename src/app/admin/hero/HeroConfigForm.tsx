"use client";
import { useState } from "react";
import Link from "next/link";

export default function HeroConfigForm({ config }: { config: Record<string, string> }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [erro, setErro] = useState("");

  const [modo, setModo] = useState(config.hero_modo ?? "cor");
  const [badge, setBadge] = useState(config.hero_badge ?? "");
  const [titulo, setTitulo] = useState(config.hero_titulo ?? "");
  const [descricao, setDescricao] = useState(config.hero_descricao ?? "");
  const [btnFornecedores, setBtnFornecedores] = useState(config.hero_btn_fornecedores !== "0");
  const [btnAnunciar, setBtnAnunciar] = useState(config.hero_btn_anunciar !== "0");
  const [btnsNoHeader, setBtnsNoHeader] = useState(config.hero_btns_no_header === "1");

  async function handleSave() {
    setSaving(true);
    setErro("");
    setSaved(false);
    const res = await fetch("/api/admin/config-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero_modo: modo,
        hero_badge: badge,
        hero_titulo: titulo,
        hero_descricao: descricao,
        hero_btn_fornecedores: btnFornecedores ? "1" : "0",
        hero_btn_anunciar: btnAnunciar ? "1" : "0",
        hero_btns_no_header: btnsNoHeader ? "1" : "0",
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setErro("Erro ao salvar configurações");
    }
    setSaving(false);
  }

  const field = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]";
  const muted = modo === "banner";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Modo de exibição */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Fundo da seção Hero</h2>
        <p className="text-sm text-gray-400 mb-4">Escolha entre fundo azul com textos ou um banner rotativo de imagens.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: "cor", label: "Cor sólida", desc: "Fundo azul padrão com textos editáveis abaixo" },
            { value: "banner", label: "Banner rotativo", desc: "Imagens giram automaticamente — ideal para publicidade" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setModo(opt.value)}
              className={`text-left p-4 rounded-lg border-2 transition-colors ${
                modo === opt.value
                  ? "border-[#2E86AB] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{opt.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
        {modo === "banner" && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            Cadastre os banners do hero em{" "}
            <Link href="/admin/banners/novo" className="font-semibold underline">
              Banners → Novo banner
            </Link>{" "}
            e selecione a posição <strong>Hero (tela cheia)</strong>.
          </div>
        )}
      </div>

      {/* Textos */}
      <div className={`bg-white rounded-xl border border-gray-100 p-6 space-y-4 transition-opacity ${muted ? "opacity-40 pointer-events-none select-none" : ""}`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-900">Textos do Hero</h2>
          {muted && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Inativo no modo banner</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Texto do badge</label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className={field}
            placeholder="Curadoria de quem esteve em +200 eventos ISP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título principal</label>
          <textarea
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            rows={2}
            className={field}
            placeholder="Encontre o fornecedor certo para o seu provedor de internet"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className={field}
            placeholder="fornecedores verificados, organizados por categoria..."
          />
          <p className="text-xs text-gray-400 mt-1">
            O número atual de fornecedores é inserido automaticamente antes deste texto.
          </p>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Botões de ação</h2>
        <p className="text-sm text-gray-400 mb-4">Controle onde os botões de CTA aparecem no site.</p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={btnFornecedores}
              onChange={(e) => setBtnFornecedores(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-[#1B3A6B]"
            />
            <div>
              <div className="text-sm text-gray-700">
                Exibir botão <strong>&quot;Ver todos os fornecedores&quot;</strong> no hero
              </div>
              <div className="text-xs text-gray-400">Aparece na seção azul inicial da página</div>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={btnAnunciar}
              onChange={(e) => setBtnAnunciar(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-[#1B3A6B]"
            />
            <div>
              <div className="text-sm text-gray-700">
                Exibir botão <strong>&quot;Quero anunciar minha empresa&quot;</strong> no hero
              </div>
              <div className="text-xs text-gray-400">Aparece na seção azul inicial da página</div>
            </div>
          </label>
          <div className="border-t border-gray-100 pt-3 mt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={btnsNoHeader}
                onChange={(e) => setBtnsNoHeader(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#1B3A6B]"
              />
              <div>
                <div className="text-sm text-gray-700">
                  Exibir botões no <strong>cabeçalho do site</strong>
                </div>
                <div className="text-xs text-gray-400">
                  Quando ativo, o menu de navegação exibe os CTAs completos: &quot;Ver todos os fornecedores&quot; e
                  &quot;Quero anunciar minha empresa&quot;.
                </div>
              </div>
            </label>
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
