"use client";

import { Search } from "lucide-react";

export interface OranjeFilters {
  city: string;
  grootScherm: boolean;
  terras: boolean;
  nuOpen: boolean;
  live: boolean;
  atmosphere: "" | "druk" | "gezellig" | "rustig";
}

interface Props {
  filters: OranjeFilters;
  onChange: (f: OranjeFilters) => void;
  resultCount: number;
}

const atmosphereOptions: { value: OranjeFilters["atmosphere"]; label: string }[] = [
  { value: "druk", label: "Druk" },
  { value: "gezellig", label: "Gezellig" },
  { value: "rustig", label: "Rustig" },
];

export default function FilterSidebar({ filters, onChange, resultCount }: Props) {
  function toggle(key: keyof OranjeFilters) {
    onChange({ ...filters, [key]: !filters[key as keyof OranjeFilters] });
  }

  return (
    <aside className="flex flex-col gap-6 bg-white rounded-2xl p-5 border border-[rgba(169,49,0,0.1)] shadow-sm">

      {/* Search city */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
          Zoek op stad
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a5c55]" />
          <input
            type="text"
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            placeholder="Amsterdam, Rotterdam…"
            className="w-full bg-[#fff8f6] border border-[rgba(169,49,0,0.15)] rounded-full py-2 pl-9 pr-3 text-sm text-[#3f2c26] placeholder-[#7a5c55]/70 outline-none focus:border-[#a93100] focus:ring-2 focus:ring-[#a93100]/10 transition-colors"
            style={{ fontFamily: "var(--font-lexend)" }}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
          Voorzieningen
        </p>
        <div className="space-y-2.5">
          {([
            { key: "grootScherm" as const, label: "Groot scherm" },
            { key: "terras" as const, label: "Terras" },
            { key: "nuOpen" as const, label: "Nu open" },
          ]).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  filters[key]
                    ? "bg-[#a93100] border-[#a93100]"
                    : "border-[rgba(169,49,0,0.3)] group-hover:border-[#a93100]"
                }`}
                onClick={() => toggle(key)}
              >
                {filters[key] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-[#3f2c26] select-none"
                style={{ fontFamily: "var(--font-lexend)" }}
                onClick={() => toggle(key)}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Live toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
          Alleen live cafés
        </p>
        <button
          onClick={() => toggle("live")}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            filters.live ? "bg-[#a93100]" : "bg-[rgba(169,49,0,0.2)]"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              filters.live ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Atmosphere pills */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
          Sfeer
        </p>
        <div className="flex gap-2 flex-wrap">
          {atmosphereOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                onChange({
                  ...filters,
                  atmosphere: filters.atmosphere === value ? "" : value,
                })
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filters.atmosphere === value
                  ? "bg-[#a93100] text-white border-[#a93100]"
                  : "bg-transparent text-[#3f2c26] border-[rgba(169,49,0,0.25)] hover:border-[#a93100]"
              }`}
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="pt-2 border-t border-[rgba(169,49,0,0.1)]">
        <p className="text-xs text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
          <strong className="text-[#3f2c26] font-semibold">{resultCount}</strong> {resultCount === 1 ? "café" : "cafés"} gevonden
        </p>
      </div>
    </aside>
  );
}
