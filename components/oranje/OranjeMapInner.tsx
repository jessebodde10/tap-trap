"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { OranjeCafe } from "@/data/oranje-cafes";

// Orange teardrop marker
function makeMarker(isLive: boolean) {
  const color = isLive ? "#a93100" : "#7a5c55";
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 2px 5px rgba(0,0,0,0.35))">
      <svg width="28" height="40" viewBox="0 0 28 40">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 9.47 14 26 14 26S28 23.47 28 14C28 6.27 21.73 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="13.5" r="5.5" fill="white"/>
      </svg></div>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
    className: "",
  });
}

interface FlyProps {
  lat: number;
  lng: number;
  zoom?: number;
}
function FlyTo({ lat, lng, zoom = 13 }: FlyProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

interface Props {
  cafes: OranjeCafe[];
  flyTo?: { lat: number; lng: number } | null;
  onSelectCafe?: (id: string) => void;
}

export default function OranjeMapInner({ cafes, flyTo, onSelectCafe }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MapContainer
      center={[52.3, 5.3]}
      zoom={8}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={19}
      />

      {flyTo && <FlyTo lat={flyTo.lat} lng={flyTo.lng} />}

      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          position={[cafe.lat, cafe.lng]}
          icon={makeMarker(cafe.isLive)}
          eventHandlers={{
            click: () => onSelectCafe?.(cafe.id),
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p
                className="font-black text-[#3f2c26] text-sm leading-tight mb-1"
                style={{ fontFamily: "var(--font-anybody)" }}
              >
                {cafe.name}
              </p>
              <p className="text-xs text-[#7a5c55] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
                {cafe.city} · {cafe.screens}× scherm
              </p>
              {cafe.isLive && (
                <span className="inline-block bg-[#a93100] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
                  Live
                </span>
              )}
              <Link
                href={`/oranje/cafe/${cafe.id}`}
                className="block text-center text-xs font-semibold bg-[#a93100] text-white rounded-full py-1.5 px-3 hover:bg-[#d34000] transition-colors"
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                Bekijk details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
