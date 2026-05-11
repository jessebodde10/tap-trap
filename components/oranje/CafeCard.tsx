"use client";

import Link from "next/link";
import { MapPin, Monitor, TreePine, Volume2, Star } from "lucide-react";
import { OranjeCafe } from "@/data/oranje-cafes";

interface Props {
  cafe: OranjeCafe;
  distanceKm?: number;
}

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

function isOpen(cafe: OranjeCafe): boolean {
  const h = new Date().getHours();
  const { openHour: o, closeHour: c } = cafe;
  if (c > o) return h >= o && h < c;
  return h >= o || h < c;
}

export default function CafeCard({ cafe, distanceKm }: Props) {
  const open = isOpen(cafe);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(169,49,0,0.1)] hover:shadow-lg hover:-translate-y-0.5 transition-all group">
      {/* Photo */}
      <div className={`h-40 bg-gradient-to-br ${cafe.gradient} relative overflow-hidden`}>
        <img
          src={cafe.imageUrl}
          alt={cafe.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          loading="lazy"
        />
        {/* Live badge */}
        {cafe.isLive && (
          <span className="absolute top-3 left-3 bg-[#a93100] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            Live
          </span>
        )}
        {/* Open/closed badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            open
              ? "bg-white text-[#a93100]"
              : "bg-black/40 text-white/80"
          }`}
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {open ? `Open · tot ${pad(cafe.closeHour)}` : "Gesloten"}
        </span>
        {/* Distance */}
        {distanceKm !== undefined && (
          <span
            className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            <MapPin size={10} />
            {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p
          className="text-lg font-black text-[#3f2c26] leading-tight mb-0.5 group-hover:text-[#a93100] transition-colors"
          style={{ fontFamily: "var(--font-anybody)" }}
        >
          {cafe.name}
        </p>
        <p className="text-xs text-[#7a5c55] flex items-center gap-1 mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
          <MapPin size={11} />
          {cafe.city} · {cafe.address.split(",")[0]}
        </p>

        {/* Facilities row */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`flex items-center gap-1 text-xs ${cafe.screens > 0 ? "text-[#3f2c26]" : "text-[#7a5c55]"}`} style={{ fontFamily: "var(--font-lexend)" }}>
            <Monitor size={13} className={cafe.screens > 0 ? "text-[#a93100]" : "text-[#7a5c55]/50"} />
            {cafe.screens}×
          </span>
          {cafe.hasTerrace && (
            <span className="flex items-center gap-1 text-xs text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
              <TreePine size={13} className="text-[#a93100]" />
              Terras
            </span>
          )}
          {cafe.hasSound && (
            <span className="flex items-center gap-1 text-xs text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
              <Volume2 size={13} className="text-[#a93100]" />
              Geluid
            </span>
          )}
          <span className="ml-auto flex items-center gap-0.5 text-xs font-semibold text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
            <Star size={12} className="text-amber-400 fill-amber-400" />
            {cafe.rating.toFixed(1)}
          </span>
        </div>

        <Link
          href={`/oranje/cafe/${cafe.id}`}
          className="block w-full text-center bg-[#a93100] text-white text-sm font-semibold py-2.5 rounded-full hover:bg-[#d34000] transition-colors"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          Bekijk details →
        </Link>
      </div>
    </div>
  );
}
