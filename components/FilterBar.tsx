"use client";

import { Filters } from "@/types";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onLocate?: () => void;
  locating?: boolean;
}

const chips = [
  { key: "nuOpen"     as const, label: "Nu open"     },
  { key: "nachtOpen"  as const, label: "Na 01:00"    },
  { key: "grootScherm"as const, label: "Groot scherm"},
];

export default function FilterBar({ filters, onChange, onLocate, locating }: Props) {
  function toggle(key: keyof Filters) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2.5 border-b border-[rgba(26,26,26,0.1)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 bg-[#F2EDD8]">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors font-medium ${
            filters[key]
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "bg-transparent text-[#1A1A1A] border-[rgba(26,26,26,0.25)] hover:border-[rgba(26,26,26,0.5)]"
          }`}
        >
          {label}
        </button>
      ))}
      {/* Bij mij — triggers geolocation */}
      <button
        onClick={onLocate}
        disabled={locating}
        className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors font-medium ${
          locating
            ? "bg-[#1B4332] text-white border-[#1B4332] opacity-60"
            : "bg-transparent text-[#1A1A1A] border-[rgba(26,26,26,0.25)] hover:border-[rgba(26,26,26,0.5)]"
        }`}
      >
        {locating ? "…" : "Bij mij"}
      </button>
      {/* Spacer so last chip isn't clipped by overflow-x scroll */}
      <span className="shrink-0 w-4 inline-block" aria-hidden="true" />
    </div>
  );
}
