"use client";

import { Clock, Monitor, Moon } from "lucide-react";
import { Filters } from "@/types";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const chips = [
  { key: "nuOpen" as const, label: "Nu open", Icon: Clock },
  { key: "nachtOpen" as const, label: "Na 01:00 open", Icon: Moon },
  { key: "grootScherm" as const, label: "Groot scherm", Icon: Monitor },
];

export default function FilterBar({ filters, onChange }: Props) {
  function toggle(key: keyof Filters) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  return (
    <div className="relative border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Scrollable chip row — hide native scrollbar */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              filters[key]
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
      {/* Right-side fade gradient hints that more chips are off-screen */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white dark:from-gray-900" />
    </div>
  );
}
