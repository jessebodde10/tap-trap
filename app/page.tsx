"use client";

import { useState, useRef } from "react";
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

function DrukteDots({ n }: { n: number }) {
  const filled = Math.min(Math.ceil(n / 10), 3);
  return (
    <span className="inline-flex gap-0.5 items-center">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rounded-full ${i <= filled ? "bg-[#C97A0A]" : "bg-[#1A1A1A]/15"}`}
        />
      ))}
    </span>
  );
}

const SNAP_HEIGHTS = ["52px", "46vh", "84vh"] as const;

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

  function onHandleTouchStart(e: React.TouchEvent) {
    swipeStartY.current = e.touches[0].clientY;
  }
  function onHandleTouchEnd(e: React.TouchEvent) {
    if (swipeStartY.current === null) return;
    const delta = swipeStartY.current - e.changedTouches[0].clientY;
    if (delta > 40)  setSnap((s) => Math.min(s + 1, 2) as 0 | 1 | 2);
    if (delta < -40) setSnap((s) => Math.max(s - 1, 0) as 0 | 1 | 2);
    swipeStartY.current = null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F2EDD8]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] leading-none">
            Tap &amp;<span style={{ fontFamily: "var(--font-lora)", fontStyle: "italic" }}>Trap</span>
          </h1>
          <p className="text-[10px] font-medium text-[#7A7465] tracking-wider mt-0.5 uppercase">
            Editie 14 · Speeldag 3
          </p>
        </div>
        <Link
          href="/aanmelden"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-lg font-light hover:bg-[#1B4332] transition-colors"
          aria-label="Café aanmelden"
        >
          +
        </Link>
      </div>

      {/* ── Match banner ── */}
      <div className="mx-4 mb-2 rounded-xl bg-[#1B4332] px-4 py-2.5 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 leading-none mb-0.5">
            Vanavond
          </p>
          <p className="text-base font-bold text-white leading-tight tracking-wide">
            NED — BRA · 21:00
          </p>
        </div>
        <button
          onClick={() => setFilters((f) => ({ ...f, nuOpen: true }))}
          className="bg-[#C97A0A] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#B86E09] transition-colors whitespace-nowrap"
        >
          {filtered.length} cafés tonen
        </button>
      </div>

      {/* ── Search ── */}
      <SearchBar onCityFound={(c) => setFlyTo({ coords: c, zoom: 13 })} />

      {/* ── Filters ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onLocate={handleLocate}
        locating={locating}
      />

      {/* ── Map + swipeable sheet ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Map */}
        <div className="absolute inset-0">
          <MapWrapper
            locations={filtered}
            flyTo={flyTo}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* ── Bottom sheet ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[500] flex flex-col bg-[#F2EDD8] transition-[height] duration-300 ease-out shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ height: SNAP_HEIGHTS[snap] }}
        >
          {/* Handle area — swipe zone */}
          <div
            className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={onHandleTouchStart}
            onTouchEnd={onHandleTouchEnd}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-[#1A1A1A]/15" />
            </div>

            {/* Section header */}
            <div className="flex items-center justify-between px-4 pb-2">
              <span
                className="text-base font-medium text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-lora)", fontStyle: "italic" }}
              >
                In de buurt
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7A7465] font-medium uppercase tracking-wider">
                  Op afstand ↑
                </span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setSnap(i as 0 | 1 | 2)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        snap === i ? "bg-[#1B4332]" : "bg-[#1A1A1A]/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-[rgba(26,26,26,0.08)] mx-4" />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <span className="text-3xl">🔍</span>
                <p className="text-sm font-medium text-[#7A7465]">Geen cafés gevonden</p>
                <p className="text-xs text-[#7A7465]/60">Pas je filters aan</p>
              </div>
            ) : (
              <ul>
                {filtered.map((loc, i) => {
                  const open = isOpen(loc);
                  return (
                    <li key={loc.id}>
                      <button
                        onClick={() => handleLocationSelect(loc)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(26,26,26,0.06)] hover:bg-[#EDE8D0] active:bg-[#E8E3C8] transition-colors text-left"
                      >
                        {/* Number */}
                        <span
                          className="text-base font-bold text-[#C97A0A] w-7 shrink-0 text-right tabular-nums leading-none"
                          style={{ fontFamily: "var(--font-lora)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A1A1A] text-sm leading-tight truncate">
                            {loc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#7A7465]">
                              {loc.screens}× scherm
                            </span>
                            <DrukteDots n={loc.screens * 8} />
                            <span className="text-xs text-[#7A7465]">
                              {loc.screens >= 6 ? "druk" : loc.screens >= 3 ? "gezellig" : "rustig"}
                            </span>
                          </div>
                        </div>

                        {/* Badge */}
                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          open
                            ? "bg-[#1B4332] text-white"
                            : "border border-[rgba(26,26,26,0.15)] text-[#7A7465]"
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
