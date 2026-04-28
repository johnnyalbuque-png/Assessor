import Header from "@/components/Header";
import SolicitarPropostaForm from "./SolicitarPropostaForm";

export const metadata = {
  title: "Solicitar Proposta — Vitrine ISP",
  description: "Solicite propostas de fornecedores Premium da sua região.",
};

export default function SolicitarPropostaPage() {
  return (
    <>
      <Header />
      <SolicitarPropostaForm />
    </>
  );
}
