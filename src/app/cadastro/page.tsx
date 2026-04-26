"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PLANOS = [
  {
    nome: "Básico",
    preco: "R$ 297",
    cor: "border-gray-200",
    corBtn: "border border-[#1B3A6B] text-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white",
    destaque: false,
    itens: [
      "Perfil completo na plataforma",
      "Listado na categoria",
      "Contato direto (WhatsApp, e-mail, site)",
      "Selo Verificado INTER'ISP",
      "Visibilidade para +30k provedores",
    ],
  },
  {
    nome: "Destaque",
    preco: "R$ 597",
    cor: "border-[#2E86AB] ring-2 ring-[#2E86AB]/20",
    corBtn: "bg-[#2E86AB] text-white hover:bg-[#1d6a8a]",
    destaque: true,
    itens: [
      "Tudo do Básico",
      "Aparece primeiro na categoria",
      "Badge de destaque na listagem",
      "Maior visibilidade nos resultados",
    ],
  },
  {
    nome: "Premium",
    preco: "R$ 997",
    cor: "border-yellow-300 ring-2 ring-yellow-200",
    corBtn: "bg-[#1B3A6B] text-white hover:bg-[#152e56]",
    destaque: false,
    itens: [
      "Tudo do Destaque",
      "Topo absoluto em todas as buscas",
      "Banner na página inicial",
      'Tag "Recomendado por Johnny"',
      "1 menção na newsletter mensal",
      "Destaque em eventos INTER'ISP",
    ],
  },
];

export default function Cadastro() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      ...Object.fromEntries(new FormData(form)),
      mensagem: [
        (form.elements.namedItem("mensagem") as HTMLTextAreaElement).value,
        planoSelecionado ? `Plano de interesse: ${planoSelecionado}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    };
    await fetch("/api/solicitacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEnviado(true);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#1B3A6B] mb-3">Anuncie na Vitrine ISP</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Seja encontrado por mais de 30.000 provedores de internet em todo o Brasil. Todos os planos incluem
              o Selo Verificado INTER&apos;ISP.
            </p>
          </div>

          {/* Tabela de planos */}
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {PLANOS.map((p) => (
              <div
                key={p.nome}
                className={`bg-white rounded-2xl border p-7 flex flex-col ${p.cor} ${
                  planoSelecionado === p.nome ? "shadow-lg" : ""
                }`}
              >
                {p.destaque && (
                  <div className="text-xs font-semibold text-[#2E86AB] uppercase tracking-wider mb-3">
                    Mais popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.nome}</h3>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-[#1B3A6B]">{p.preco}</span>
                  <span className="text-gray-400 text-sm">/mês</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {p.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setPlanoSelecionado(p.nome);
                    document.getElementById("form-cadastro")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${p.corBtn}`}
                >
                  {planoSelecionado === p.nome ? "✓ Selecionado" : `Quero o ${p.nome}`}
                </button>
              </div>
            ))}
          </div>

          {/* Receitas secundárias */}
          <div className="bg-gray-50 rounded-2xl p-7 mb-14 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Outras oportunidades de visibilidade</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
              {[
                { label: "Patrocínio de categoria", valor: "R$ 2.000–5.000/mês" },
                { label: "Menção na newsletter", valor: "R$ 500–1.500/edição" },
                { label: "Destaque em eventos INTER'ISP", valor: "R$ 1.000–3.000/evento" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="font-medium text-gray-800 mb-1">{item.label}</p>
                  <p className="text-[#2E86AB] font-semibold">{item.valor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div id="form-cadastro" className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Solicitar cadastro</h2>
              <p className="text-gray-500 text-sm">
                Preencha o formulário e Johnny entrará em contato para finalizar.
              </p>
            </div>

            {enviado ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-green-800 mb-2">Solicitação enviada!</h2>
                <p className="text-green-700">
                  Recebemos seu pedido. Em breve o Johnny entrará em contato com você.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                {planoSelecionado && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-[#1B3A6B] font-medium">
                    Plano selecionado: {planoSelecionado}
                    <button
                      type="button"
                      onClick={() => setPlanoSelecionado("")}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da empresa *</label>
                  <input
                    name="empresa"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    name="telefone"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    O que sua empresa oferece?
                  </label>
                  <textarea
                    name="mensagem"
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Enviando..." : "Enviar solicitação"}
                </button>
                <p className="text-xs text-center text-gray-400">Sem fidelidade · Johnny entra em contato em até 24h</p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
