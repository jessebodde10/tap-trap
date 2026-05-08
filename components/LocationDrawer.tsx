"use client";

import { useState } from "react";
import { X, MapPin, Tv, Leaf, Clock, Monitor, Navigation } from "lucide-react";
import { Location } from "@/types";

interface Props {
  location: Location | null;
  onClose: () => void;
}

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

function formatTimeRange(open: number, close: number) {
  const spansMidnight = close < open;
  return `${pad(open)} – ${pad(close)}${spansMidnight ? " 's nachts" : ""}`;
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
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
          location ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel
          Mobile : fixed slide-up from bottom
          Desktop: fixed panel below the header (top driven by --header-h CSS var set in page.tsx) */}
      <div
        style={{ ["--tw-top" as string]: "var(--header-h, 220px)" }}
        className={`
          fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white shadow-2xl
          transition-all duration-300 ease-out dark:bg-gray-900
          md:inset-x-auto md:right-4 md:bottom-auto md:w-96 md:rounded-2xl
          [top:auto] md:[top:var(--header-h,220px)]
          ${location
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none md:translate-y-2 md:opacity-0"
          }
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {location && (
          <>
            {/* Swipe handle — mobile only */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700 md:hidden" />

            <div className="p-5">
              {/* Name + close */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {location.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={12} />
                    {location.address}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Open/closed status */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                    open
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${open ? "bg-green-500" : "bg-red-500"}`} />
                  {open ? "Nu open" : `Gesloten · opent ${pad(location.openHour)}`}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Clock size={11} />
                  {formatTimeRange(location.openHour, location.closeHour)}
                </span>
              </div>

              {/* Google Maps button */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + " " + location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
              >
                <Navigation size={14} />
                Open in Google Maps
              </a>

              {/* Feature grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <Tile
                  icon={<Tv size={17} className="text-orange-500" />}
                  label="Schermen"
                  value={String(location.screens)}
                  active
                  color="orange"
                />
                <Tile
                  icon={<Leaf size={17} className={location.hasTerrace ? "text-green-600" : "text-gray-400"} />}
                  label="Terras"
                  value={location.hasTerrace ? "Ja" : "Nee"}
                  active={location.hasTerrace}
                  color="green"
                />
                <Tile
                  icon={<Monitor size={17} className={location.hasLargeScreen ? "text-blue-500" : "text-gray-400"} />}
                  label="Groot scherm"
                  value={location.hasLargeScreen ? "Ja" : "Nee"}
                  active={location.hasLargeScreen}
                  color="blue"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Tile({
  icon, label, value, active, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  color: "orange" | "green" | "blue";
}) {
  const bg = active
    ? color === "orange" ? "bg-orange-50 dark:bg-orange-900/20"
    : color === "green"  ? "bg-green-50 dark:bg-green-900/20"
    :                      "bg-blue-50 dark:bg-blue-900/20"
    : "bg-gray-50 opacity-50 dark:bg-gray-800";

  return (
    <div className={`flex items-center gap-2 rounded-xl p-3 ${bg}`}>
      {icon}
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-semibold text-gray-900 dark:text-white text-sm">{value}</div>
      </div>
    </div>
  );
}
