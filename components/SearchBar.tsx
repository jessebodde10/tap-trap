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
    <div className="px-4 py-2.5 border-b border-[#2A2A2A] shrink-0">
      <form onSubmit={handleSearch} className="flex items-center gap-0">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(""); }}
            placeholder="Zoek café, buurt of straat…"
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] border-r-0 py-2.5 pl-9 pr-3 text-sm font-semibold text-white placeholder-white/25 outline-none focus:border-[#F5A800] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F5A800] text-black px-4 py-2.5 border border-[#F5A800] disabled:opacity-50 transition-opacity"
        >
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : <Search size={16} />
          }
        </button>
      </form>
      {error && (
        <p className="mt-1 text-xs font-bold text-red-400 uppercase tracking-wide">{error}</p>
      )}
    </div>
  );
}
