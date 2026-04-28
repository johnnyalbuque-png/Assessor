"use client";
import { useState } from "react";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const ESTADOS_NOME: Record<string, string> = {
  AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",
  DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",
  MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",
  PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",
  RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",
  SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins",
};

function formatCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function formatCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, "$1-$2");
}

export default function SolicitarPropostaForm() {
  const [form, setForm] = useState({
    empresa: "", cnpj: "", responsavel: "", whatsapp: "", email: "",
    oque: "", quantidade: "", logradouro: "", numero: "", bairro: "",
    cidade: "", estado: "", cep: "", prazo: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao enviar solicitação.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Solicitação enviada!</h1>
          <p className="text-gray-600 mb-2">
            Sua proposta foi registrada com sucesso. Os fornecedores Premium da sua região
            foram notificados e entrarão em contato diretamente com você.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Fique atento ao seu WhatsApp e e-mail.
          </p>
          <a
            href="/"
            className="inline-block mt-8 bg-[#1B3A6B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#152d54] transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Solicitar Proposta</h1>
        <p className="text-gray-500 mt-2">
          Preencha o formulário abaixo e os fornecedores Premium da sua região receberão sua
          solicitação e entrarão em contato diretamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Dados da empresa</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da empresa <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.empresa}
                onChange={(e) => set("empresa", e.target.value)}
                placeholder="Razão social ou nome fantasia"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.cnpj}
                onChange={(e) => set("cnpj", formatCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.responsavel}
                onChange={(e) => set("responsavel", e.target.value)}
                placeholder="Nome do responsável"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">O que você procura?</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto / Serviço <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.oque}
              onChange={(e) => set("oque", e.target.value)}
              placeholder="Descreva o produto ou serviço que você precisa..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.quantidade}
                onChange={(e) => set("quantidade", e.target.value)}
                placeholder="Ex: 100 unidades, 10 caixas..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo desejado
              </label>
              <input
                value={form.prazo}
                onChange={(e) => set("prazo", e.target.value)}
                placeholder="Ex: 30 dias, urgente..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Endereço de entrega</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logradouro <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.logradouro}
                onChange={(e) => set("logradouro", e.target.value)}
                placeholder="Rua, Avenida, Alameda..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                value={form.numero}
                onChange={(e) => set("numero", e.target.value)}
                placeholder="123"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                value={form.bairro}
                onChange={(e) => set("bairro", e.target.value)}
                placeholder="Bairro"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.cidade}
                onChange={(e) => set("cidade", e.target.value)}
                placeholder="Cidade"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] bg-white"
              >
                <option value="">Selecione o estado</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf} — {ESTADOS_NOME[uf]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input
                value={form.cep}
                onChange={(e) => set("cep", formatCEP(e.target.value))}
                placeholder="00000-000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-400">
            Apenas fornecedores Premium da sua região receberão esta solicitação.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B3A6B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#152d54] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? "Enviando..." : "Enviar solicitação"}
          </button>
        </div>
      </form>
    </div>
  );
}
