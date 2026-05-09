"use client";

import { useState } from "react";
import { X, MapPin, ArrowLeft } from "lucide-react";
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
      {/* Backdrop — mobile only (desktop drawer is a floating panel, no overlay needed) */}
      <div
        className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 md:hidden ${
          location ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-[700]
          max-h-[92svh] flex flex-col
          transition-all duration-300 ease-out
          md:inset-x-auto md:right-4 md:bottom-4 md:w-96
          ${location
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
          }
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {location && (
          <>
            {/* Green header */}
            <div className="bg-[#1B4332] shrink-0">
              {/* Swipe handle */}
              <div className="flex justify-center pt-2 md:hidden">
                <div className="h-1 w-10 rounded-full bg-white/20" />
              </div>

              <div className="px-5 pt-3 pb-5">
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ArrowLeft size={16} className="text-white" />
                  </button>
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <span className="text-white text-sm">✏</span>
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <span className="text-white text-sm">★</span>
                    </button>
                  </div>
                </div>

                {/* Category label */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C97A0A] mb-2">
                  {location.hasTerrace ? "Terras" : "Café"} · {location.city}
                </p>

                {/* Café name */}
                <h2
                  className="text-3xl font-bold text-white leading-tight mb-3"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {location.name}
                </h2>

                {/* Status row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${open ? "bg-[#C97A0A]" : "bg-white/30"}`} />
                    <span className="text-sm font-medium text-white/90">
                      {open
                        ? `Open tot ${pad(location.closeHour)}`
                        : `Gesloten · opent ${pad(location.openHour)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/50">
                    <MapPin size={11} />
                    {location.address.split(",")[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable cream body */}
            <div className="flex-1 overflow-y-auto bg-[#F2EDD8]">
              {/* Feature rows */}
              <div className="divide-y divide-[rgba(26,26,26,0.08)] px-5">
                <FeatureRow label="Schermen" value={`${location.screens}× ${location.hasLargeScreen ? "groot" : "normaal"}`} />
                <FeatureRow label="Terras" value={location.hasTerrace ? "Aanwezig" : "Niet aanwezig"} dim={!location.hasTerrace} />
                <FeatureRow label="Groot scherm" value={location.hasLargeScreen ? "Ja" : "Nee"} dim={!location.hasLargeScreen} />
                <FeatureRow label="Openingstijden" value={`${pad(location.openHour)} – ${pad(location.closeHour)}`} />
              </div>

              {/* CTA */}
              <div className="p-5">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + " " + location.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 bg-[#1A1A1A] text-white rounded-full py-4 text-sm font-semibold hover:bg-[#1B4332] transition-colors"
                >
                  Routebeschrijving
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function FeatureRow({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7465] shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm font-medium text-right ${dim ? "text-[#7A7465]" : "text-[#1A1A1A]"}`}>{value}</span>
    </div>
  );
}
