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
        setError("Stad niet gevonden — probeer een andere spelling");
      } else {
        onCityFound([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setError("");
        setQuery("");
      }
    } catch {
      setError("Zoekopdracht mislukt, controleer je verbinding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(""); }}
            placeholder="Zoek een stad…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          <span className="hidden sm:inline">Zoeken</span>
        </button>
      </form>
      {/* Error renders inline below the input — no floating overlap */}
      {error && (
        <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
