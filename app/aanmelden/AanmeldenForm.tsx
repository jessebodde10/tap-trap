"use client";

import { useState } from "react";
import { MapPin, CheckCircle, Loader2, CheckCheck } from "lucide-react";
import Link from "next/link";
import { addLocation } from "./actions";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

function hourLabel(h: number, openHour: number) {
  const spansNight = h < openHour && h > 0;
  if (spansNight) return `${pad(h)} (+1, 's nachts)`;
  if (h === 0) return `00:00 (middernacht)`;
  return pad(h);
}

interface FormState {
  name: string;
  address: string;
  city: string;
  lat: string;
  lng: string;
  screens: string;
  openHour: string;
  closeHour: string;
  hasTerrace: boolean;
  hasLargeScreen: boolean;
}

export default function AanmeldenForm() {
  const [form, setForm] = useState<FormState>({
    name: "", address: "", city: "", lat: "", lng: "",
    screens: "2", openHour: "12", closeHour: "23",
    hasTerrace: false, hasLargeScreen: false,
  });
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; name: string } | null>(null);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function geocode(address: string, city: string) {
    if (!address.trim() || !city.trim()) return;
    setGeocoding(true);
    setGeocodeError("");
    try {
      const q = `${address}, ${city}, Nederland`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { "Accept-Language": "nl" } }
      );
      const data = await res.json();
      if (!data.length) {
        setGeocodeError("Adres niet gevonden. Controleer straat en stad.");
      } else {
        set("lat", parseFloat(data[0].lat).toFixed(6));
        set("lng", parseFloat(data[0].lon).toFixed(6));
        setGeocodeError("");
      }
    } catch {
      setGeocodeError("Geocodering mislukt. Probeer opnieuw.");
    } finally {
      setGeocoding(false);
    }
  }

  // Auto-geocode when the user finishes filling in city (last of the two address fields)
  function handleCityBlur() {
    if (form.address.trim() && form.city.trim() && !form.lat) {
      geocode(form.address, form.city);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lat || !form.lng) {
      setGeocodeError("Locatie is verplicht. Vul adres + stad in en wacht op automatische bepaling.");
      return;
    }
    setSubmitting(true);
    try {
      await addLocation({
        name: form.name.trim(),
        address: `${form.address.trim()}, ${form.city.trim()}`,
        city: form.city.trim(),
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        screens: parseInt(form.screens),
        openHour: parseInt(form.openHour),
        closeHour: parseInt(form.closeHour),
        hasTerrace: form.hasTerrace,
        hasLargeScreen: form.hasLargeScreen,
      });
      setResult({ success: true, name: form.name });
    } catch {
      setResult({ success: false, name: form.name });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Café toegevoegd!</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            <strong>{result.name}</strong> staat nu op de WK Spotter-kaart.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 transition-colors">
            Bekijk op de kaart
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setForm({ name: "", address: "", city: "", lat: "", lng: "", screens: "2", openHour: "12", closeHour: "23", hasTerrace: false, hasLargeScreen: false });
            }}
            className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Nog een café
          </button>
        </div>
      </div>
    );
  }

  const openHourNum = parseInt(form.openHour);
  const hasCoords = !!form.lat && !!form.lng;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">
      {/* Naam */}
      <div>
        <label className="label">Naam van het café</label>
        <input required type="text" value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="bijv. Café De Oranje Leeuw" className="input" />
      </div>

      {/* Adres */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Straat + huisnummer</label>
          <input required type="text" value={form.address}
            onChange={(e) => { set("address", e.target.value); set("lat", ""); set("lng", ""); }}
            onBlur={() => { if (form.address.trim() && form.city.trim() && !form.lat) geocode(form.address, form.city); }}
            placeholder="bijv. Leidseplein 12" className="input" />
        </div>
        <div>
          <label className="label">Stad</label>
          <input required type="text" value={form.city}
            onChange={(e) => { set("city", e.target.value); set("lat", ""); set("lng", ""); }}
            onBlur={handleCityBlur}
            placeholder="bijv. Amsterdam" className="input" />
        </div>
      </div>

      {/* Locatie-status — verplichte stap, visueel prominent */}
      <div className={`rounded-xl border-2 p-3 transition-all ${
        hasCoords
          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
          : geocodeError
          ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
          : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10"
      }`}>
        {geocoding ? (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Loader2 size={15} className="animate-spin text-orange-500" />
            Locatie bepalen…
          </div>
        ) : hasCoords ? (
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCheck size={15} />
            <span>
              Locatie gevonden: {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
            </span>
            <button type="button" onClick={() => geocode(form.address, form.city)}
              className="ml-auto text-xs text-green-600 underline hover:text-green-800 dark:text-green-500">
              Opnieuw
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-orange-500 shrink-0" />
            <span className="text-sm text-orange-700 dark:text-orange-400">
              {geocodeError || "Vul adres + stad in — locatie wordt automatisch bepaald"}
            </span>
          </div>
        )}
      </div>

      {/* Openingstijden */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Openingstijd</label>
          <select value={form.openHour} onChange={(e) => set("openHour", e.target.value)} className="input">
            {HOUR_OPTIONS.map((h) => <option key={h} value={h}>{pad(h)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sluitingstijd</label>
          <select value={form.closeHour} onChange={(e) => set("closeHour", e.target.value)} className="input">
            {HOUR_OPTIONS.map((h) => (
              <option key={h} value={h}>{hourLabel(h, openHourNum)}</option>
            ))}
          </select>
          {parseInt(form.closeHour) < openHourNum && (
            <p className="mt-1 text-xs text-orange-500">Sluit de volgende dag om {pad(parseInt(form.closeHour))}</p>
          )}
        </div>
      </div>

      {/* Schermen */}
      <div>
        <label className="label">Aantal schermen</label>
        <input type="number" min={1} max={20} value={form.screens}
          onChange={(e) => set("screens", e.target.value)} className="input w-28" />
      </div>

      {/* Kenmerken */}
      <div className="space-y-2.5">
        <label className="label">Kenmerken</label>
        {[
          { key: "hasLargeScreen" as const, label: "📺 Groot scherm aanwezig (>100\")" },
          { key: "hasTerrace" as const, label: "☀️ Terras aanwezig" },
        ].map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <input type="checkbox" checked={form[key] as boolean}
              onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      <button type="submit" disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50">
        {submitting ? <><Loader2 size={16} className="animate-spin" />Toevoegen…</> : "Café toevoegen aan WK Spotter"}
      </button>
    </form>
  );
}
