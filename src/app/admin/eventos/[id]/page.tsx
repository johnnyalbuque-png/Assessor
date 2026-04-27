import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventoForm from "../EventoForm";

export const dynamic = "force-dynamic";

export default async function EditarEvento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const evento = await prisma.evento.findUnique({ where: { id } });
  if (!evento) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar Evento</h1>
      <EventoForm
        inicial={{
          id: evento.id,
          titulo: evento.titulo,
          descricao: evento.descricao,
          data: evento.data.toISOString(),
          local: evento.local,
          cidade: evento.cidade,
          link: evento.link,
          imagem: evento.imagem,
          ativo: evento.ativo,
          destaque: evento.destaque,
        }}
      />
    </div>
  );
}
