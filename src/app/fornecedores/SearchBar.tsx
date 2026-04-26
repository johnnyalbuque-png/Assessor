"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.push(`/fornecedores?${params.toString()}`);
  }

  function clearSearch() {
    setQ("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/fornecedores?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nome ou descrição..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
      />
      {q && (
        <button
          type="button"
          onClick={clearSearch}
          className="border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="bg-[#1B3A6B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152e56] transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
