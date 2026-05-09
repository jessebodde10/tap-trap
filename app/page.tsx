"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import rawLocations from "@/data/locations.json";
import type { Location, Filters, FlyToTarget } from "@/types";
import MapWrapper from "@/components/MapWrapper";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import LocationDrawer from "@/components/LocationDrawer";

const locations = rawLocations as Location[];

// Eerste wedstrijd Nederland WK 2026
const NEXT_MATCH = {
  label: "Eerst volgende wedstrijd",
  teams: "NED — JPN",
  time: "22:00",
  date: "14 juni",
};

// City → province mapping
const CITY_TO_PROVINCE: Record<string, string> = {
  Amsterdam: "Noord-Holland",
  Rotterdam: "Zuid-Holland",
  "Den Haag": "Zuid-Holland",
  Utrecht: "Utrecht",
  Groningen: "Groningen",
  Leeuwarden: "Friesland",
  Zwolle: "Overijssel",
  Nijmegen: "Gelderland",
  Middelburg: "Zeeland",
  Eindhoven: "Noord-Brabant",
  Maastricht: "Limburg",
};

function getProvince(city: string): string {
  return CITY_TO_PROVINCE[city] ?? city;
}

function isOpen(loc: Location): boolean {
  const h = new Date().getHours();
  const { openHour: o, closeHour: c } = loc;
  if (c > o) return h >= o && h < c;
  return h >= o || h < c;
}

function isNachtOpen(loc: Location): boolean {
  return loc.closeHour < loc.openHour && loc.closeHour >= 2;
}


export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    nuOpen: false, grootScherm: false, nachtOpen: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<FlyToTarget>(null);
  const [locating, setLocating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileView, setMobileView] = useState<"kaart" | "lijst">("kaart");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Detect desktop breakpoint
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = locations.filter((loc) => {
    if (filters.nuOpen && !isOpen(loc)) return false;
    if (filters.nachtOpen && !isNachtOpen(loc)) return false;
    if (filters.grootScherm && !loc.hasLargeScreen) return false;
    return true;
  });

  // Province list derived from filtered set
  const provinces = [...new Set(filtered.map((l) => getProvince(l.city)))].sort();

  // Province-filtered items for list view
  const listedLocations = selectedProvince
    ? filtered.filter((l) => getProvince(l.city) === selectedProvince)
    : filtered;

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

  // ── Shared café list (desktop sidebar + mobile lijst) ──
  function CafeList({ items }: { items: Location[] }) {
    return (
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm font-medium text-[#7A7465]">Geen cafés gevonden</p>
            <p className="text-xs text-[#7A7465]/60">Pas je filters aan</p>
          </div>
        ) : (
          <ul>
            {items.map((loc, i) => {
              const open = isOpen(loc);
              return (
                <li key={loc.id}>
                  <button
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(26,26,26,0.06)] hover:bg-[#EDE8D0] active:bg-[#E8E3C8] transition-colors text-left"
                  >
                    <span
                      className="text-base font-bold text-[#C97A0A] w-7 shrink-0 text-right tabular-nums leading-none"
                      style={{ fontFamily: "var(--font-lora)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A1A1A] text-sm leading-tight truncate">
                        {loc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#7A7465]">{loc.screens}× scherm</span>
                      </div>
                    </div>
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
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F2EDD8]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] leading-none">
            Tap <span style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontWeight: 700 }}>&amp;Trap</span>
          </h1>
          <p className="text-[10px] font-medium text-[#7A7465] tracking-wider mt-0.5 uppercase">
            Editie 14 · Speeldag 3
          </p>
        </div>
        <Link
          href="/aanmelden"
          className="text-sm font-medium text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] rounded-full px-3 py-1.5 hover:bg-[#EDE8D0] hover:border-[rgba(26,26,26,0.4)] transition-colors whitespace-nowrap"
        >
          Café aanmelden
        </Link>
      </div>

      {/* ── Match banner ── */}
      <div className="mx-4 mb-2 rounded-xl bg-[#1B4332] px-4 py-2.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 leading-none mb-0.5">
            {NEXT_MATCH.label}
          </p>
          <p className="text-base font-bold text-white leading-tight tracking-wide truncate">
            {NEXT_MATCH.teams} · {NEXT_MATCH.time}
            <span className="text-white/50 font-normal text-sm ml-2">{NEXT_MATCH.date}</span>
          </p>
        </div>
        <span className="bg-[#C97A0A] text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
          {filtered.length} cafés
        </span>
      </div>

      {/* ── Search (full width, always) ── */}
      <SearchBar onCityFound={(c) => setFlyTo({ coords: c, zoom: 13 })} />

      {/* ── Filters (full width, always) ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onLocate={handleLocate}
        locating={locating}
      />

      {/* ── Mobile Kaart / Lijst toggle ── */}
      {!isDesktop && (
        <div className="mx-4 my-2 flex p-1 bg-[#EDE8D0] rounded-full shrink-0">
          <button
            onClick={() => setMobileView("kaart")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-full transition-colors ${
              mobileView === "kaart"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#7A7465] hover:text-[#1A1A1A]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h1A1.5 1.5 0 0 1 4 1.5v1A1.5 1.5 0 0 1 2.5 4h-1A1.5 1.5 0 0 1 0 2.5v-1zM5 1.5A1.5 1.5 0 0 1 6.5 0h1A1.5 1.5 0 0 1 9 1.5v1A1.5 1.5 0 0 1 7.5 4h-1A1.5 1.5 0 0 1 5 2.5v-1zm5 0A1.5 1.5 0 0 1 11.5 0h1A1.5 1.5 0 0 1 14 1.5v1A1.5 1.5 0 0 1 12.5 4h-1A1.5 1.5 0 0 1 10 2.5v-1zM0 6.5A1.5 1.5 0 0 1 1.5 5h1A1.5 1.5 0 0 1 4 6.5v1A1.5 1.5 0 0 1 2.5 9h-1A1.5 1.5 0 0 1 0 7.5v-1z"/></svg>
            Kaart
          </button>
          <button
            onClick={() => setMobileView("lijst")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-full transition-colors ${
              mobileView === "lijst"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#7A7465] hover:text-[#1A1A1A]"
            }`}
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><rect x="4" width="10" height="2" rx="1"/><rect x="4" y="5" width="10" height="2" rx="1"/><rect x="4" y="10" width="10" height="2" rx="1"/><circle cx="1" cy="1" r="1"/><circle cx="1" cy="6" r="1"/><circle cx="1" cy="11" r="1"/></svg>
            Lijst
          </button>
        </div>
      )}

      {/* ── Main content ── */}
      <div className={`flex-1 overflow-hidden ${isDesktop ? "flex flex-row" : ""}`}>

        {isDesktop ? (
          /* ── DESKTOP: sidebar left + map right ── */
          <>
            <div className="w-80 flex flex-col border-r border-[rgba(26,26,26,0.1)] bg-[#F2EDD8] overflow-hidden">
              <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-[rgba(26,26,26,0.08)]">
                <span
                  className="text-base font-medium text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-lora)", fontStyle: "italic" }}
                >
                  In de buurt
                </span>
                <span className="text-xs text-[#7A7465] font-medium">
                  {filtered.length} cafés
                </span>
              </div>
              <CafeList items={filtered} />
            </div>

            <div className="flex-1 relative">
              <MapWrapper
                locations={filtered}
                flyTo={flyTo}
                onLocationSelect={handleLocationSelect}
              />
              {!selectedLocation && (
                <button
                  onClick={handleLocate}
                  disabled={locating}
                  className="absolute right-3 bottom-4 z-[999] flex flex-col items-center gap-0.5 bg-white/90 backdrop-blur-sm border border-[rgba(26,26,26,0.12)] rounded-xl px-3 py-2 shadow-sm disabled:opacity-50 hover:bg-white transition-colors"
                >
                  {locating
                    ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1B4332] border-t-transparent" />
                    : <span className="text-[#1B4332] text-base">◎</span>
                  }
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#7A7465]">
                    {locating ? "…" : "Locatie"}
                  </span>
                </button>
              )}
            </div>
          </>
        ) : mobileView === "kaart" ? (
          /* ── MOBILE KAART: fullscreen map ── */
          <div className="relative h-full">
            <MapWrapper
              locations={filtered}
              flyTo={flyTo}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        ) : (
          /* ── MOBILE LIJST: province filter + full list ── */
          <div className="flex flex-col h-full overflow-hidden bg-[#F2EDD8]">

            {/* Province chips */}
            <div className="flex gap-2 overflow-x-auto px-4 py-2.5 border-b border-[rgba(26,26,26,0.08)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              <button
                onClick={() => setSelectedProvince(null)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                  !selectedProvince
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-transparent text-[#1A1A1A] border-[rgba(26,26,26,0.25)] hover:border-[rgba(26,26,26,0.5)]"
                }`}
              >
                Heel NL
              </button>
              {provinces.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProvince(p === selectedProvince ? null : p)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    selectedProvince === p
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-transparent text-[#1A1A1A] border-[rgba(26,26,26,0.25)] hover:border-[rgba(26,26,26,0.5)]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="shrink-0 w-4 inline-block" aria-hidden="true" />
            </div>

            {/* List header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-[rgba(26,26,26,0.08)]">
              <span
                className="text-base font-medium text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-lora)", fontStyle: "italic" }}
              >
                {selectedProvince ?? "In de buurt"}
              </span>
              <span className="text-xs text-[#7A7465] font-medium uppercase tracking-wider">
                {listedLocations.length} cafés
              </span>
            </div>

            <CafeList items={listedLocations} />
          </div>
        )}
      </div>

      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
