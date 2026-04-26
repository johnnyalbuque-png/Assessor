"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  tipo?: "logo" | "banner" | "default";
  aspect?: "square" | "wide" | "any";
  hint?: string;
};

export default function ImageUpload({ value, onChange, tipo = "default", aspect = "any", hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function upload(file: File) {
    setErro("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("tipo", tipo);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setErro(data.error ?? "Erro no upload");
      else onChange(data.url);
    } catch {
      setErro("Erro de conexão");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) upload(f);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) upload(f);
  }

  const previewClass =
    aspect === "square"
      ? "w-full max-w-[120px] h-[120px] object-contain"
      : aspect === "wide"
      ? "w-full h-28 object-cover"
      : "w-full h-24 object-contain";

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`${previewClass} mx-auto`} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-white text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              {uploading ? "Enviando..." : "Trocar"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-white text-xs bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-[#2E86AB] hover:bg-blue-50/30 transition-colors select-none"
        >
          {uploading ? (
            <p className="text-sm text-[#2E86AB] font-medium animate-pulse">Enviando e convertendo...</p>
          ) : (
            <>
              <div className="text-2xl mb-1.5">🖼️</div>
              <p className="text-sm font-medium text-gray-700">Clique ou arraste a imagem aqui</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF — máx 8 MB · salvo como WebP</p>
              {hint && <p className="text-xs text-gray-400">{hint}</p>}
            </>
          )}
        </div>
      )}

      {/* Fallback: URL manual */}
      {!value && (
        showUrl ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (urlInput) { onChange(urlInput); setUrlInput(""); setShowUrl(false); } } }}
              placeholder="https://exemplo.com/imagem.png"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/30"
              autoFocus
            />
            <button
              type="button"
              onClick={() => { if (urlInput) { onChange(urlInput); setUrlInput(""); setShowUrl(false); } }}
              disabled={!urlInput}
              className="text-xs bg-[#1B3A6B] text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              OK
            </button>
            <button type="button" onClick={() => setShowUrl(false)} className="text-xs text-gray-400 hover:text-gray-700 px-1">✕</button>
          </div>
        ) : (
          <button type="button" onClick={() => setShowUrl(true)} className="text-xs text-gray-400 hover:text-[#2E86AB] transition-colors">
            ou cole uma URL diretamente
          </button>
        )
      )}

      {erro && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}
    </div>
  );
}
