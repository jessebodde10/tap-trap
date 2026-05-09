"use client";

import { useEffect } from "react";
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

function createNumberIcon(n: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;background:white;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:'Barlow Condensed',system-ui,sans-serif;font-weight:800;
      font-size:12px;color:#0D0D0D;border:2px solid #0D0D0D;
      box-shadow:0 2px 6px rgba(0,0,0,0.4)
    ">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

interface Props {
  locations: Location[];
  flyTo: FlyToTarget;
  onLocationSelect: (loc: Location) => void;
}

export default function MapComponent({ locations, flyTo, onLocationSelect }: Props) {
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
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToController target={flyTo} />
      {locations.map((loc, i) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={createNumberIcon(i + 1)}
          eventHandlers={{ click: () => onLocationSelect(loc) }}
        />
      ))}
    </MapContainer>
  );
}
