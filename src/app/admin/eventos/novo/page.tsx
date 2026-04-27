import EventoForm from "../EventoForm";

export const dynamic = "force-dynamic";

export default function NovoEvento() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Novo Evento</h1>
      <EventoForm />
    </div>
  );
}
