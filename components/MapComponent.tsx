"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Location, FlyToTarget } from "@/types";

function FlyToController({ target }: { target: FlyToTarget }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target.coords, target.zoom, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

function createPinIcon(color: string, size = 36) {
  const half = size / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 100 130">
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0004"/>
    </filter>
    <path d="M50 0C30.7 0 15 15.7 15 35c0 24.3 35 75 35 75s35-50.7 35-75C85 15.7 69.3 0 50 0z"
          fill="${color}" filter="url(#sh)"/>
    <circle cx="50" cy="35" r="16" fill="white" opacity="0.95"/>
  </svg>`;
  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [size, size * 1.3],
    iconAnchor: [half, size * 1.3],
    popupAnchor: [0, -(size * 1.3)],
  });
}

interface Props {
  locations: Location[];
  flyTo: FlyToTarget;
  onLocationSelect: (loc: Location) => void;
}

export default function MapComponent({ locations, flyTo, onLocationSelect }: Props) {
  const orangeIcon = useMemo(() => createPinIcon("#f97316"), []);

  return (
    <MapContainer
      center={[52.3, 5.29]}
      zoom={8}
      minZoom={7}
      maxZoom={18}
      maxBounds={[[50.5, 3.1], [53.8, 7.5]]}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToController target={flyTo} />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={orangeIcon}
          eventHandlers={{ click: () => onLocationSelect(loc) }}
        />
      ))}
    </MapContainer>
  );
}
