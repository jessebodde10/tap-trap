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

const amberDotIcon = L.divIcon({
  className: "",
  html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.32))">
    <svg width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 8.8 13 25 13 25S26 21.8 26 13C26 5.82 20.18 0 13 0z" fill="#C97A0A"/>
      <circle cx="13" cy="12.5" r="5" fill="white"/>
    </svg>
  </div>`,
  iconSize: [26, 38],
  iconAnchor: [13, 38],
});

interface Props {
  locations: Location[];
  flyTo: FlyToTarget;
  onLocationSelect: (loc: Location) => void;
}

export default function MapComponent({ locations, flyTo, onLocationSelect }: Props) {
  // Stable icon reference
  const icon = useMemo(() => amberDotIcon, []);

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
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FlyToController target={flyTo} />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={icon}
          eventHandlers={{ click: () => onLocationSelect(loc) }}
        />
      ))}
    </MapContainer>
  );
}
