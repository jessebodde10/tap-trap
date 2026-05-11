"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopNavBar from "@/components/oranje/TopNavBar";
import FilterSidebar, { OranjeFilters } from "@/components/oranje/FilterSidebar";
import CafeCard from "@/components/oranje/CafeCard";
import OranjeMapWrapper from "@/components/oranje/OranjeMapWrapper";
import { oranjeCafes, OranjeCafe } from "@/data/oranje-cafes";
import { Map, List } from "lucide-react";

function isOpenNow(cafe: OranjeCafe): boolean {
  const h = new Date().getHours();
  const { openHour: o, closeHour: c } = cafe;
  if (c > o) return h >= o && h < c;
  return h >= o || h < c;
}

const DEFAULT_FILTERS: OranjeFilters = {
  city: "",
  grootScherm: false,
  terras: false,
  nuOpen: false,
  live: false,
  atmosphere: "",
};

function ZoekContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<OranjeFilters>({
    ...DEFAULT_FILTERS,
    city: searchParams.get("stad") ?? "",
  });
  const [view, setView] = useState<"list" | "map">("list");
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  // Update city filter when URL param changes
  useEffect(() => {
    const stad = searchParams.get("stad");
    if (stad) setFilters((f) => ({ ...f, city: stad }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return oranjeCafes.filter((cafe) => {
      if (filters.city && !cafe.city.toLowerCase().includes(filters.city.toLowerCase()) &&
          !cafe.name.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.grootScherm && !cafe.hasLargeScreen) return false;
      if (filters.terras && !cafe.hasTerrace) return false;
      if (filters.nuOpen && !isOpenNow(cafe)) return false;
      if (filters.live && !cafe.isLive) return false;
      if (filters.atmosphere && cafe.atmosphere !== filters.atmosphere) return false;
      return true;
    });
  }, [filters]);

  function handleSelectCafe(id: string) {
    const cafe = oranjeCafes.find((c) => c.id === id);
    if (cafe) setFlyTo({ lat: cafe.lat, lng: cafe.lng });
  }

  return (
    <div className="min-h-screen bg-[#fff8f6] flex flex-col pt-[72px]">
      <TopNavBar />

      {/* Page header */}
      <div className="bg-white border-b border-[rgba(169,49,0,0.1)] px-4 md:px-8 py-5">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-black text-[#3f2c26]"
              style={{ fontFamily: "var(--font-anybody)" }}
            >
              Cafés vinden
            </h1>
            <p className="text-sm text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
              {filtered.length} Oranje-cafés gevonden
            </p>
          </div>

          {/* Mobile view toggle */}
          <div className="md:hidden flex bg-[#fff8f6] rounded-full p-1 border border-[rgba(169,49,0,0.15)]">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  view === v ? "bg-[#a93100] text-white" : "text-[#3f2c26]"
                }`}
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                {v === "list" ? <List size={13} /> : <Map size={13} />}
                {v === "list" ? "Lijst" : "Kaart"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-8 py-6 flex gap-6">

        {/* Sidebar — desktop always visible, mobile hidden */}
        <aside className="hidden md:block w-64 shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} resultCount={filtered.length} />
        </aside>

        {/* Mobile: filters always shown above content */}
        <div className="md:hidden w-full">
          <div className="mb-4">
            <FilterSidebar filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </div>

          {view === "list" ? (
            <div className="grid grid-cols-1 gap-4">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)
              )}
            </div>
          ) : (
            <div className="h-[50vh] rounded-2xl overflow-hidden border border-[rgba(169,49,0,0.15)]">
              <OranjeMapWrapper cafes={filtered} flyTo={flyTo} onSelectCafe={handleSelectCafe} />
            </div>
          )}
        </div>

        {/* Desktop: side-by-side list + map */}
        <div className="hidden md:flex flex-1 gap-6 min-h-[600px]">
          {/* Café list */}
          <div className="flex-1 grid grid-cols-1 gap-4 content-start overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {filtered.length === 0 ? (
              <div className="col-span-1">
                <EmptyState />
              </div>
            ) : (
              filtered.map((cafe) => (
                <div
                  key={cafe.id}
                  onClick={() => handleSelectCafe(cafe.id)}
                  className="cursor-pointer"
                >
                  <CafeCard cafe={cafe} />
                </div>
              ))
            )}
          </div>

          {/* Map */}
          <div className="w-[420px] xl:w-[520px] shrink-0 rounded-2xl overflow-hidden border border-[rgba(169,49,0,0.15)] sticky top-4 self-start h-[calc(100vh-180px)]">
            <OranjeMapWrapper cafes={filtered} flyTo={flyTo} onSelectCafe={handleSelectCafe} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <span className="text-5xl block mb-4">🔍</span>
      <p className="font-black text-[#3f2c26] text-xl mb-2" style={{ fontFamily: "var(--font-anybody)" }}>
        Geen cafés gevonden
      </p>
      <p className="text-[#7a5c55] text-sm" style={{ fontFamily: "var(--font-lexend)" }}>
        Pas je filters aan of zoek in een andere stad.
      </p>
    </div>
  );
}

export default function ZoekPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff8f6]" />}>
      <ZoekContent />
    </Suspense>
  );
}
