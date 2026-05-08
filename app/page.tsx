"use client";

import { useState, useRef, useEffect } from "react";
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

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<Filters>({
    nuOpen: false, grootScherm: false, nachtOpen: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [flyTo, setFlyTo] = useState<FlyToTarget>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-h", `${h + 8}px`);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map fills the full screen including behind the header */}
      <div className="absolute inset-0 z-0">
        <MapWrapper
          locations={filtered}
          flyTo={flyTo}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* Floating header — hovers over the map */}
      <div ref={headerRef} className="relative z-10 px-3 pt-3">
        <div className="rounded-2xl bg-white/95 shadow-2xl backdrop-blur-md dark:bg-gray-900/95 overflow-hidden">
          {/* Title row */}
          <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1">
            <div>
              <h1 className="text-base font-black leading-tight tracking-tight text-gray-900 dark:text-white">
                Tap & Trap
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {filtered.length} locatie{filtered.length !== 1 ? "s" : ""} gevonden
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/aanmelden"
                className="text-xs text-gray-400 hover:text-orange-500 transition-colors dark:text-gray-500 dark:hover:text-orange-400"
              >
                + aanmelden
              </Link>
              <LogoImage className="h-11 w-auto" />
            </div>
          </div>
          <SearchBar onCityFound={(c) => setFlyTo({ coords: c, zoom: 13 })} />
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[40] flex justify-center px-4" style={{ top: "var(--header-h, 200px)" }}>
          <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-5 py-3 shadow-lg dark:bg-gray-800/95">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Geen cafés gevonden</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pas je filters aan om locaties te zien</p>
            </div>
          </div>
        </div>
      )}

      {/* Locate-me button */}
      <button
        onClick={handleLocate}
        disabled={locating}
        className="absolute right-4 bottom-6 z-[999] flex flex-col items-center gap-0.5 rounded-2xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-200 transition hover:bg-orange-50 disabled:opacity-50 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-700"
      >
        {locating ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
        ) : (
          <Navigation size={18} className="text-orange-500" />
        )}
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
          {locating ? "…" : "Locatie"}
        </span>
      </button>

      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
