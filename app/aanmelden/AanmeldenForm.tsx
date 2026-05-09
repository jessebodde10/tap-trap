"use client";

import { useState } from "react";
import { CheckCircle, Loader2, CheckCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { addLocation } from "./actions";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

type ScreenCount = "1" | "2-3" | "4+";
type ScreenSize = "klein" | "middel" | "groot";
type Geluid = "aan" | "uit" | "soms";
type Sfeer = "bruine kroeg" | "sportcafé" | "terras" | "families" | "live muziek";

interface FormState {
  name: string;
  address: string;
  city: string;
  lat: string;
  lng: string;
  screenCount: ScreenCount;
  screenSize: ScreenSize;
  geluid: Geluid;
  sfeer: Sfeer[];
  openHour: string;
  closeHour: string;
}

function OptionButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border transition-colors ${
        active
          ? "bg-[#F5A800] border-[#F5A800] text-black"
          : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
      {children}
    </p>
  );
}

export default function AanmeldenForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    name: "", address: "", city: "", lat: "", lng: "",
    screenCount: "2-3", screenSize: "middel", geluid: "aan", sfeer: [],
    openHour: "12", closeHour: "23",
  });
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; name: string } | null>(null);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSfeer(s: Sfeer) {
    setForm((f) => ({
      ...f,
      sfeer: f.sfeer.includes(s) ? f.sfeer.filter((x) => x !== s) : [...f.sfeer, s],
    }));
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

  function handleCityBlur() {
    if (form.address.trim() && form.city.trim() && !form.lat) {
      geocode(form.address, form.city);
    }
  }

  async function handleSubmit() {
    if (!form.lat || !form.lng) {
      setGeocodeError("Locatie is verplicht.");
      setStep(1);
      return;
    }
    setSubmitting(true);
    const screensMap: Record<ScreenCount, number> = { "1": 1, "2-3": 2, "4+": 4 };
    try {
      await addLocation({
        name: form.name.trim(),
        address: `${form.address.trim()}, ${form.city.trim()}`,
        city: form.city.trim(),
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        screens: screensMap[form.screenCount],
        openHour: parseInt(form.openHour),
        closeHour: parseInt(form.closeHour),
        hasTerrace: form.sfeer.includes("terras"),
        hasLargeScreen: form.screenSize === "groot",
      });
      setResult({ success: true, name: form.name });
    } catch {
      setResult({ success: false, name: form.name });
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Success screen ───
  if (result?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center bg-[#F5A800]">
          <CheckCircle size={40} className="text-black" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Café toegevoegd!</h2>
          <p className="mt-2 text-sm text-white/50 font-bold uppercase tracking-wide">
            {result.name} staat nu op de kaart
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="bg-[#F5A800] text-black px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Bekijk op kaart
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setStep(1);
              setForm({
                name: "", address: "", city: "", lat: "", lng: "",
                screenCount: "2-3", screenSize: "middel", geluid: "aan", sfeer: [],
                openHour: "12", closeHour: "23",
              });
            }}
            className="border border-white/20 text-white/60 px-6 py-3 font-black uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors"
          >
            Nog een café
          </button>
        </div>
      </div>
    );
  }

  // ─── Step indicator ───
  const stepLabels = ["Jouw café", "Hoe kijken?", "Openingstijden", "Bevestigen"];

  return (
    <div className="space-y-0">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {stepLabels.map((label, i) => (
          <div key={i} className={`flex-1 text-center py-2 border-b-2 transition-colors ${
            i + 1 === step
              ? "border-[#F5A800] text-[#F5A800]"
              : i + 1 < step
              ? "border-white/20 text-white/40"
              : "border-[#2A2A2A] text-white/20"
          }`}>
            <span className="text-[9px] font-black uppercase tracking-widest block">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      {/* ─── Stap 1: Café info ─── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mb-1">Stap 01/04</p>
            <h2 className="text-3xl font-black uppercase leading-tight text-white">
              Wat is de naam van jouw café?
            </h2>
          </div>

          <div>
            <label className="label">Naam café</label>
            <input
              required type="text" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="bijv. Café De Oranje Leeuw"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Straat + huisnummer</label>
              <input
                required type="text" value={form.address}
                onChange={(e) => { set("address", e.target.value); set("lat", ""); set("lng", ""); }}
                onBlur={() => { if (form.address.trim() && form.city.trim() && !form.lat) geocode(form.address, form.city); }}
                placeholder="bijv. Leidseplein 12"
                className="input"
              />
            </div>
            <div>
              <label className="label">Stad</label>
              <input
                required type="text" value={form.city}
                onChange={(e) => { set("city", e.target.value); set("lat", ""); set("lng", ""); }}
                onBlur={handleCityBlur}
                placeholder="bijv. Amsterdam"
                className="input"
              />
            </div>
          </div>

          {/* Geocode status */}
          <div className={`border p-3 text-sm transition-all ${
            form.lat
              ? "border-[#F5A800]/40 bg-[#F5A800]/10"
              : geocodeError
              ? "border-red-500/40 bg-red-500/10"
              : "border-[#2A2A2A] bg-[#1A1A1A]"
          }`}>
            {geocoding ? (
              <div className="flex items-center gap-2 text-white/50 font-bold">
                <Loader2 size={14} className="animate-spin text-[#F5A800]" />
                <span className="text-xs uppercase tracking-wide">Locatie bepalen…</span>
              </div>
            ) : form.lat ? (
              <div className="flex items-center gap-2 text-[#F5A800] font-bold">
                <CheckCheck size={14} />
                <span className="text-xs uppercase tracking-wide">
                  Locatie gevonden · {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => geocode(form.address, form.city)}
                  className="ml-auto text-[10px] text-[#F5A800]/60 underline hover:text-[#F5A800]"
                >
                  Opnieuw
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white/40 font-bold">
                <MapPin size={14} className="text-white/25 shrink-0" />
                <span className="text-xs uppercase tracking-wide">
                  {geocodeError || "Vul adres + stad in — locatie wordt automatisch bepaald"}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!form.name.trim() || !form.address.trim() || !form.city.trim()}
            onClick={() => setStep(2)}
            className="w-full bg-[#F5A800] text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Volgende stap →
          </button>
        </div>
      )}

      {/* ─── Stap 2: Hoe kijken? ─── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mb-1">Stap 02/04</p>
            <h2 className="text-3xl font-black uppercase leading-tight text-white">
              Hoe kijken jullie de wedstrijd?
            </h2>
          </div>

          <div>
            <SectionLabel>Schermen</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["1", "2-3", "4+"] as ScreenCount[]).map((v) => (
                <OptionButton key={v} active={form.screenCount === v} onClick={() => set("screenCount", v)}>
                  {v}
                </OptionButton>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Grootste scherm</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              <OptionButton active={form.screenSize === "klein"} onClick={() => set("screenSize", "klein")}>Klein &lt;40&quot;</OptionButton>
              <OptionButton active={form.screenSize === "middel"} onClick={() => set("screenSize", "middel")}>Middel 40–60&quot;</OptionButton>
              <OptionButton active={form.screenSize === "groot"} onClick={() => set("screenSize", "groot")}>Groot 60&quot;+</OptionButton>
            </div>
          </div>

          <div>
            <SectionLabel>Geluid</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["aan", "uit", "soms"] as Geluid[]).map((v) => (
                <OptionButton key={v} active={form.geluid === v} onClick={() => set("geluid", v)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </OptionButton>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Sfeer · max 3</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["bruine kroeg", "sportcafé", "terras", "families", "live muziek"] as Sfeer[]).map((v) => (
                <OptionButton
                  key={v}
                  active={form.sfeer.includes(v)}
                  onClick={() => toggleSfeer(v)}
                >
                  {v}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border border-white/20 text-white/50 px-6 py-4 font-black uppercase tracking-widest text-sm hover:border-white/40 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 bg-[#F5A800] text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors"
            >
              Volgende stap →
            </button>
          </div>
        </div>
      )}

      {/* ─── Stap 3: Openingstijden ─── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mb-1">Stap 03/04</p>
            <h2 className="text-3xl font-black uppercase leading-tight text-white">
              Wanneer zijn jullie open?
            </h2>
          </div>

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
                {HOUR_OPTIONS.map((h) => <option key={h} value={h}>{pad(h)}</option>)}
              </select>
              {parseInt(form.closeHour) < parseInt(form.openHour) && (
                <p className="mt-1 text-[10px] font-bold text-[#F5A800] uppercase tracking-wide">
                  Sluit volgende dag om {pad(parseInt(form.closeHour))}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-white/20 text-white/50 px-6 py-4 font-black uppercase tracking-widest text-sm hover:border-white/40 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 bg-[#F5A800] text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors"
            >
              Volgende stap →
            </button>
          </div>
        </div>
      )}

      {/* ─── Stap 4: Bevestiging ─── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800] mb-1">Stap 04/04</p>
            <h2 className="text-3xl font-black uppercase leading-tight text-white">
              Klopt alles?
            </h2>
          </div>

          <div className="border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            {[
              { label: "Naam", value: form.name },
              { label: "Adres", value: `${form.address}, ${form.city}` },
              { label: "Schermen", value: form.screenCount },
              { label: "Groot scherm", value: form.screenSize },
              { label: "Geluid", value: form.geluid },
              { label: "Sfeer", value: form.sfeer.join(", ") || "—" },
              { label: "Openingstijden", value: `${pad(parseInt(form.openHour))} – ${pad(parseInt(form.closeHour))}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4 px-4 py-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 w-28 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm font-black uppercase text-white">{value}</span>
              </div>
            ))}
          </div>

          {!form.lat && (
            <p className="text-xs font-bold text-red-400 uppercase tracking-wide">
              ⚠ Locatie nog niet bepaald — ga terug naar stap 1
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="border border-white/20 text-white/50 px-6 py-4 font-black uppercase tracking-widest text-sm hover:border-white/40 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              disabled={submitting || !form.lat}
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F5A800] text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Toevoegen…</> : "Indienen →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
