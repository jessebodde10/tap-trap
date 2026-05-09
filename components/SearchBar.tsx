"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface Props {
  onCityFound: (coords: [number, number]) => void;
}

export default function SearchBar({ onCityFound }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Nederland&format=json&limit=1`,
        { headers: { "Accept-Language": "nl" } }
      );
      const data = await res.json();
      if (data.length === 0) {
        setError("Stad niet gevonden");
      } else {
        onCityFound([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setError("");
        setQuery("");
      }
    } catch {
      setError("Zoekopdracht mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-2.5 border-b border-[rgba(26,26,26,0.1)] shrink-0 bg-[#F2EDD8]">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7465]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(""); }}
            placeholder="Zoek café, buurt of straat…"
            className="w-full bg-white/70 border border-[rgba(26,26,26,0.15)] rounded-full py-2 pl-9 pr-3 text-sm text-[#1A1A1A] placeholder-[#7A7465] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B4332] text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 hover:bg-[#2D6A4F] transition-colors shrink-0"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
        </button>
      </form>
      {error && (
        <p className="mt-1 pl-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
