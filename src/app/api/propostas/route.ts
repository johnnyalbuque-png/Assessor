import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";

const ESTADO_PARA_REGIAO: Record<string, string> = {
  AC: "Norte", AP: "Norte", AM: "Norte", PA: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste",
  PB: "Nordeste", PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-Oeste", GO: "Centro-Oeste", MT: "Centro-Oeste", MS: "Centro-Oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { empresa, cnpj, responsavel, whatsapp, email, oque, quantidade, logradouro, numero, bairro, cidade, estado, cep, prazo } = body;

  if (!empresa || !cnpj || !responsavel || !whatsapp || !email || !oque || !quantidade || !logradouro || !cidade || !estado) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  // Save to DB
  const solicitacao = await prisma.solicitacaoProposta.create({
    data: { empresa, cnpj, responsavel, whatsapp, email, oque, quantidade, logradouro, numero: numero || null, bairro: bairro || null, cidade, estado, cep: cep || null, prazo: prazo || null },
  });

  // Find Premium suppliers in this region
  const regiao = ESTADO_PARA_REGIAO[estado.toUpperCase()];
  if (regiao) {
    const fornecedores = await prisma.fornecedor.findMany({
      where: { plano: "PREMIUM", ativo: true, regioes: { has: regiao } },
      select: { nome: true, email: true },
    }).catch(() => []);

    const enderecoEntrega = [logradouro, numero, bairro, cidade, estado, cep].filter(Boolean).join(", ");

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#1B3A6B;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">Nova Solicitação de Proposta</h1>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Vitrine ISP — ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:40%">Empresa</td><td style="padding:8px 0;font-weight:600;color:#111">${empresa}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">CNPJ</td><td style="padding:8px 0;color:#111">${cnpj}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Responsável</td><td style="padding:8px 0;color:#111">${responsavel}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">O que procura</td><td style="padding:8px 0;font-weight:600;color:#1B3A6B">${oque}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Quantidade</td><td style="padding:8px 0;color:#111">${quantidade}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Endereço de entrega</td><td style="padding:8px 0;color:#111">${enderecoEntrega}</td></tr>
            ${prazo ? `<tr><td style="padding:8px 0;color:#6b7280">Prazo desejado</td><td style="padding:8px 0;color:#111">${prazo}</td></tr>` : ""}
          </table>
          <div style="margin-top:20px;padding:16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd">
            <p style="margin:0 0 8px;font-weight:600;color:#0369a1;font-size:14px">Responder diretamente ao provedor:</p>
            <p style="margin:0;font-size:14px">💬 WhatsApp: <a href="https://wa.me/55${whatsapp.replace(/\D/g,"")}" style="color:#1B3A6B">${whatsapp}</a></p>
            <p style="margin:4px 0 0;font-size:14px">✉️ E-mail: <a href="mailto:${email}" style="color:#1B3A6B">${email}</a></p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:16px">
            Esta solicitação foi enviada para fornecedores Premium da região ${regiao} via Vitrine ISP.
          </p>
        </div>
      </div>
    `;

    await Promise.allSettled(
      fornecedores
        .filter((f) => f.email)
        .map((f) => enviarEmail(f.email!, `Nova Solicitação de Proposta — ${empresa}`, html))
    );
  }

  return NextResponse.json({ id: solicitacao.id }, { status: 201 });
}
