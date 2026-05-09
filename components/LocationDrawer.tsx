"use client";

import { useState } from "react";
import { X, MapPin } from "lucide-react";
import { Location } from "@/types";

interface Props {
  location: Location | null;
  onClose: () => void;
}

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

function isOpen(loc: Location): boolean {
  const h = new Date().getHours();
  const { openHour: o, closeHour: c } = loc;
  if (c > o) return h >= o && h < c;
  return h >= o || h < c;
}

export default function LocationDrawer({ location, onClose }: Props) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartY(e.touches[0].clientY);
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY === null) return;
    if (e.changedTouches[0].clientY - touchStartY > 60) onClose();
    setTouchStartY(null);
  }

  const open = location ? isOpen(location) : false;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          location ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-50 overflow-hidden
          transition-all duration-300 ease-out
          md:inset-x-auto md:right-4 md:bottom-4 md:w-96
          ${location
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none md:translate-y-4 md:opacity-0"
          }
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {location && (
          <div className="bg-[#0D0D0D] overflow-hidden">
            {/* Swipe handle — mobile */}
            <div className="flex justify-center pt-2 pb-1 md:hidden bg-[#F5A800]">
              <div className="h-1 w-10 rounded-full bg-black/20" />
            </div>

            {/* Amber header */}
            <div className="bg-[#F5A800] px-5 pt-3 pb-5">
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50">
                  {location.city}
                </span>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-7 h-7 bg-black/10 hover:bg-black/20 transition-colors"
                >
                  <X size={14} className="text-black" />
                </button>
              </div>

              {/* Café name */}
              <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-black mb-3">
                {location.name}
              </h2>

              {/* Status row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${open ? "bg-black" : "bg-black/30"}`} />
                  <span className="text-xs font-black uppercase tracking-wide text-black">
                    {open
                      ? `Open · tot ${pad(location.closeHour)}`
                      : `Gesloten · opent ${pad(location.openHour)}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-black/40">
                  <MapPin size={10} />
                  {location.address.split(",")[0]}
                </div>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-px bg-[#2A2A2A] border-b border-[#2A2A2A]">
              <FeatureCell label="Schermen" value={`${location.screens} · ${location.hasLargeScreen ? "Groot" : "Normaal"}`} />
              <FeatureCell label="Terras" value={location.hasTerrace ? "Ja" : "Nee"} dim={!location.hasTerrace} />
              <FeatureCell label="Groot scherm" value={location.hasLargeScreen ? "Ja" : "Nee"} dim={!location.hasLargeScreen} />
              <FeatureCell label="Openingstijden" value={`${pad(location.openHour)}–${pad(location.closeHour)}`} />
            </div>

            {/* Routebeschrijving CTA */}
            <div className="p-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + " " + location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 bg-white text-black py-4 text-sm font-black uppercase tracking-widest hover:bg-[#F5A800] transition-colors"
              >
                Routebeschrijving →
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function FeatureCell({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="bg-[#0D0D0D] px-4 py-3">
      <div className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-1">{label}</div>
      <div className={`text-sm font-black uppercase tracking-wide ${dim ? "text-white/25" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
