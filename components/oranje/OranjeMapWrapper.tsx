"use client";

import dynamic from "next/dynamic";
import { OranjeCafe } from "@/data/oranje-cafes";

const OranjeMapInner = dynamic(() => import("./OranjeMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#e8e0d8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#a93100] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
          Kaart laden…
        </p>
      </div>
    </div>
  ),
});

interface Props {
  cafes: OranjeCafe[];
  flyTo?: { lat: number; lng: number } | null;
  onSelectCafe?: (id: string) => void;
  className?: string;
}

export default function OranjeMapWrapper({ cafes, flyTo, onSelectCafe, className }: Props) {
  return (
    <div className={className ?? "w-full h-full"}>
      <OranjeMapInner cafes={cafes} flyTo={flyTo} onSelectCafe={onSelectCafe} />
    </div>
  );
}
