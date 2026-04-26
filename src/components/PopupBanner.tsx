"use client";
import { useState, useEffect } from "react";

type Props = {
  ativo: boolean;
  titulo: string;
  descricao: string;
  imagem: string;
  link: string;
  delay: number;
};

export default function PopupBanner({ ativo, titulo, descricao, imagem, link, delay }: Props) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    if (sessionStorage.getItem("popup_visto")) return;
    const t = setTimeout(() => setVisivel(true), delay * 1000);
    return () => clearTimeout(t);
  }, [ativo, delay]);

  function fechar() {
    setVisivel(false);
    sessionStorage.setItem("popup_visto", "1");
  }

  if (!visivel) return null;

  const conteudo = (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full mx-4 animate-fade-in">
      {/* Botão fechar */}
      <button
        onClick={fechar}
        className="absolute top-3 right-3 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors text-lg leading-none"
        aria-label="Fechar"
      >
        ×
      </button>

      {/* Imagem */}
      {imagem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imagem} alt={titulo || "Popup"} className="w-full object-cover max-h-64" />
      )}

      {/* Texto */}
      {(titulo || descricao) && (
        <div className="p-6">
          {titulo && <h3 className="text-lg font-bold text-gray-900 mb-2">{titulo}</h3>}
          {descricao && <p className="text-gray-600 text-sm leading-relaxed">{descricao}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) fechar(); }}
    >
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" onClick={fechar}>
          {conteudo}
        </a>
      ) : (
        conteudo
      )}
    </div>
  );
}
