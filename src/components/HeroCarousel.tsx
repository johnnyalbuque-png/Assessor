"use client";
import { useState, useEffect, useCallback } from "react";

type BannerItem = { id: string; imagem: string; link: string | null; titulo: string | null };

export default function HeroCarousel({ banners }: { banners: BannerItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [banners.length, paused, next]);

  if (banners.length === 0) return null;

  return (
    <div
      className="relative w-full h-64 md:h-[380px] overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {b.link ? (
            <a href={b.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.imagem} alt={b.titulo ?? "Banner"} className="w-full h-full object-cover" />
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.imagem} alt={b.titulo ?? "Banner"} className="w-full h-full object-cover" />
          )}
        </div>
      ))}

      {/* Dots navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next arrows (only on hover for multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
