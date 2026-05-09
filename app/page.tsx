"use client";

import { useState, useRef } from "react";
import { Navigation } from "lucide-react";
import Link from "next/link";

import rawLocations from "@/data/locations.json";
import type { Location, Filters, FlyToTarget } from "@/types";
import MapWrapper from "@/components/MapWrapper";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import LocationDrawer from "@/components/LocationDrawer";

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

// 0 = peek (just handle), 1 = half, 2 = full
const SNAP_HEIGHTS = ["56px", "48vh", "85vh"] as const;

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    nuOpen: false, grootScherm: false, nachtOpen: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<FlyToTarget>(null);
  const [locating, setLocating] = useState(false);
  const [snap, setSnap] = useState<0 | 1 | 2>(1);
  const swipeStartY = useRef<number | null>(null);

  const filtered = locations.filter((loc) => {
    if (filters.nuOpen && !isOpen(loc)) return false;
    if (filters.nachtOpen && !isNachtOpen(loc)) return false;
    if (filters.grootScherm && !loc.hasLargeScreen) return false;
    return true;
  });

  function handleLocationSelect(loc: Location) {
    setSelectedLocation(loc);
    setFlyTo({ coords: [loc.lat, loc.lng], zoom: 16 });
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

  // Swipe handlers — only on the handle bar to avoid scroll conflicts
  function onHandleTouchStart(e: React.TouchEvent) {
    swipeStartY.current = e.touches[0].clientY;
  }
  function onHandleTouchEnd(e: React.TouchEvent) {
    if (swipeStartY.current === null) return;
    const delta = swipeStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) setSnap((s) => Math.min(s + 1, 2) as 0 | 1 | 2);      // swipe up
    else if (delta < -40) setSnap((s) => Math.max(s - 1, 0) as 0 | 1 | 2); // swipe down
    swipeStartY.current = null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0D0D0D]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2A2A2A] shrink-0">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
            Tap &amp; Trap
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mt-0.5">
            Vanavond · NED·BRA · 21:00
          </p>
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

      {/* ── Map + swipeable list sheet ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Map fills the full area */}
        <div className="absolute inset-0">
          <MapWrapper
            locations={filtered}
            flyTo={flyTo}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Locate button — hidden when drawer is open */}
        {!selectedLocation && (
          <button
            onClick={handleLocate}
            disabled={locating}
            className="absolute right-3 z-[998] flex flex-col items-center gap-0.5 bg-[#0D0D0D]/90 border border-[#2A2A2A] px-3 py-2 disabled:opacity-50 hover:border-[#F5A800] transition-colors"
            style={{ bottom: `calc(${SNAP_HEIGHTS[snap]} + 12px)` }}
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

        {/* ── Bottom sheet ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[500] flex flex-col bg-[#0D0D0D] transition-[height] duration-300 ease-out"
          style={{ height: SNAP_HEIGHTS[snap] }}
        >
          {/* Handle bar — captures swipe */}
          <div
            className="shrink-0 flex flex-col items-center justify-center gap-1.5 pt-2 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={onHandleTouchStart}
            onTouchEnd={onHandleTouchEnd}
          >
            <div className="h-1 w-10 rounded-full bg-white/20" />
            <div className="w-full flex items-center justify-between px-4">
              <span className="text-xs font-black uppercase tracking-widest text-white">De lijst</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">
                  Op afstand
                </span>
                {/* Snap indicator dots */}
                <div className="flex gap-1 ml-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setSnap(i as 0 | 1 | 2)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        snap === i ? "bg-[#F5A800]" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* List content — scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
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
                        className="w-full flex items-center gap-4 px-4 py-3 border-b border-[#1A1A1A] hover:bg-white/5 active:bg-white/10 transition-colors text-left"
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
        </div>
      </div>

      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
