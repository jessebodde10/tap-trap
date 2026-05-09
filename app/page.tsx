"use client";

import { useState } from "react";
import { Navigation } from "lucide-react";
import Link from "next/link";

import rawLocations from "@/data/locations.json";
import type { Location, Filters, FlyToTarget } from "@/types";
import MapWrapper from "@/components/MapWrapper";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import LocationDrawer from "@/components/LocationDrawer";
import LogoImage from "@/components/LogoImage";

const locations = rawLocations as Location[];

function isOpen(loc: Location): boolean {
  const h = new Date().getHours();
  const { openHour: o, closeHour: c } = loc;
  if (c > o) return h >= o && h < c;
  return h >= o || h < c;
}

function isNachtOpen(loc: Location): boolean {
  return loc.closeHour < loc.openHour && loc.closeHour >= 2;
}

function ScreenBars({ n }: { n: number }) {
  const filled = Math.min(n, 4);
  return (
    <span className="inline-flex gap-px items-end">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`inline-block w-1 rounded-sm ${i <= filled ? "bg-[#F5A800]" : "bg-white/15"}`}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    nuOpen: false, grootScherm: false, nachtOpen: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<FlyToTarget>(null);
  const [locating, setLocating] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const filtered = locations.filter((loc) => {
    if (filters.nuOpen && !isOpen(loc)) return false;
    if (filters.nachtOpen && !isNachtOpen(loc)) return false;
    if (filters.grootScherm && !loc.hasLargeScreen) return false;
    return true;
  });

  function handleLocationSelect(loc: Location) {
    setSelectedLocation(loc);
    if (viewMode === "map") setFlyTo({ coords: [loc.lat, loc.lng], zoom: 16 });
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFlyTo({ coords: [pos.coords.latitude, pos.coords.longitude], zoom: 14 });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10_000 }
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0D0D0D]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2A2A2A] shrink-0">
        <div className="flex items-center gap-3">
          <LogoImage className="h-9 w-auto" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
              Tap &amp; Trap
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mt-0.5">
              Vanavond · NED·BRA · 21:00
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Link
            href="/aanmelden"
            className="border border-[#F5A800] text-[#F5A800] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-[#F5A800] hover:text-black transition-colors"
          >
            + Aanmelden
          </Link>
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/25">
            {filtered.length} cafés
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <SearchBar onCityFound={(c) => setFlyTo({ coords: c, zoom: 13 })} />

      {/* ── Filters ── */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* ── KAART / LIJST toggle ── */}
      <div className="flex shrink-0 border-b border-[#2A2A2A]">
        {(["map", "list"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
              viewMode === mode
                ? "bg-[#F5A800] text-black"
                : "text-white/40 hover:text-white"
            }`}
          >
            {mode === "map" ? "Kaart" : "Lijst"}
          </button>
        ))}
      </div>

      {/* ── Map (only in map mode) ── */}
      {viewMode === "map" && (
        <div className="relative shrink-0 h-[40vh]">
          <MapWrapper
            locations={filtered}
            flyTo={flyTo}
            onLocationSelect={handleLocationSelect}
          />
          {!selectedLocation && (
            <button
              onClick={handleLocate}
              disabled={locating}
              className="absolute right-3 bottom-3 z-[999] flex flex-col items-center gap-0.5 bg-[#0D0D0D]/90 border border-[#2A2A2A] px-3 py-2 disabled:opacity-50 hover:border-[#F5A800] transition-colors"
            >
              {locating
                ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F5A800] border-t-transparent" />
                : <Navigation size={16} className="text-[#F5A800]" />
              }
              <span className="text-[9px] font-black uppercase tracking-wider text-white/40">
                {locating ? "…" : "Locatie"}
              </span>
            </button>
          )}
        </div>
      )}

      {/* ── DE LIJST ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2A2A] sticky top-0 bg-[#0D0D0D] z-10">
          <span className="text-xs font-black uppercase tracking-widest text-white">De lijst</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">
            Op afstand
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm font-black text-white/40 uppercase tracking-wide">Geen cafés gevonden</p>
            <p className="text-xs text-white/25">Pas je filters aan</p>
          </div>
        ) : (
          <ul>
            {filtered.map((loc, i) => {
              const open = isOpen(loc);
              return (
                <li key={loc.id}>
                  <button
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full flex items-center gap-4 px-4 py-3 border-b border-[#1A1A1A] hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xs font-black text-white/25 w-6 shrink-0 text-right tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-black uppercase tracking-wide text-white text-sm truncate leading-tight">
                        {loc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ScreenBars n={loc.screens} />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">
                          {loc.screens}× scherm
                        </span>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 ${
                      open
                        ? "bg-[#F5A800] text-black"
                        : "border border-white/15 text-white/30"
                    }`}>
                      {open ? "Open" : "Dicht"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
