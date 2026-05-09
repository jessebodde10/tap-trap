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
  html: `<div style="
    width:14px;height:14px;background:#C97A0A;border-radius:50%;
    border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.25)
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
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
