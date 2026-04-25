"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Cadastro() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    await fetch("/api/solicitacao", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setEnviado(true);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1B3A6B] mb-3">Anuncie na Vitrine ISP</h1>
            <p className="text-gray-500">
              Preencha o formulário e entraremos em contato para apresentar os planos disponíveis.
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da empresa *</label>
                <input name="empresa" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input name="telefone" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">O que sua empresa oferece?</label>
                <textarea name="mensagem" rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB] resize-none" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3A6B] hover:bg-[#152e56] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? "Enviando..." : "Enviar solicitação"}
              </button>
              <p className="text-xs text-center text-gray-400">
                Planos a partir de R$ 297/mês · Sem fidelidade
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
