"use client";

import { Filters } from "@/types";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const chips = [
  { key: "nuOpen" as const, label: "Nu open" },
  { key: "nachtOpen" as const, label: "Na 01:00" },
  { key: "grootScherm" as const, label: "Groot scherm" },
];

export default function FilterBar({ filters, onChange }: Props) {
  function toggle(key: keyof Filters) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2.5 border-b border-[#2A2A2A] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          className={`shrink-0 text-xs font-black uppercase tracking-wider px-3 py-1.5 border transition-colors ${
            filters[key]
              ? "bg-[#F5A800] border-[#F5A800] text-black"
              : "border-white/25 text-white/60 hover:border-white/50 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
