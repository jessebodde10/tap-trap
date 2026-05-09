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
type ScreenSize  = "klein" | "middel" | "groot";
type Geluid      = "aan" | "uit" | "soms";
type Sfeer       = "bruine kroeg" | "sportcafé" | "terras" | "voor families" | "live muziek";

interface FormState {
  name: string; address: string; city: string; lat: string; lng: string;
  screenCount: ScreenCount; screenSize: ScreenSize; geluid: Geluid; sfeer: Sfeer[];
  openHour: string; closeHour: string;
}

function PillOption({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
        active
          ? "bg-[#1B4332] border-[#1B4332] text-white"
          : "bg-transparent border-[rgba(26,26,26,0.2)] text-[#1A1A1A] hover:border-[rgba(26,26,26,0.4)]"
      }`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7465] mb-2.5">
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
  const [geocoding, setGeocoding]   = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState<{ success: boolean; name: string } | null>(null);

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
    setGeocoding(true); setGeocodeError("");
    try {
      const q = `${address}, ${city}, Nederland`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { "Accept-Language": "nl" } }
      );
      const data = await res.json();
      if (!data.length) {
        setGeocodeError("Adres niet gevonden.");
      } else {
        set("lat", parseFloat(data[0].lat).toFixed(6));
        set("lng", parseFloat(data[0].lon).toFixed(6));
        setGeocodeError("");
      }
    } catch {
      setGeocodeError("Geocodering mislukt.");
    } finally {
      setGeocoding(false);
    }
  }

  async function handleSubmit() {
    if (!form.lat || !form.lng) { setGeocodeError("Locatie verplicht."); setStep(1); return; }
    setSubmitting(true);
    const screensMap: Record<ScreenCount, number> = { "1": 1, "2-3": 2, "4+": 4 };
    try {
      await addLocation({
        name: form.name.trim(),
        address: `${form.address.trim()}, ${form.city.trim()}`,
        city: form.city.trim(),
        lat: parseFloat(form.lat), lng: parseFloat(form.lng),
        screens: screensMap[form.screenCount],
        openHour: parseInt(form.openHour), closeHour: parseInt(form.closeHour),
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

  // ── Success ──
  if (result?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1B4332]/10">
          <CheckCircle size={40} className="text-[#1B4332]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-lora)" }}>
            Café toegevoegd!
          </h2>
          <p className="mt-2 text-sm text-[#7A7465]">
            <strong>{result.name}</strong> staat nu op de kaart.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="bg-[#1B4332] text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-[#2D6A4F] transition-colors">
            Bekijk op kaart
          </Link>
          <button
            onClick={() => { setResult(null); setStep(1); setForm({ name:"",address:"",city:"",lat:"",lng:"",screenCount:"2-3",screenSize:"middel",geluid:"aan",sfeer:[],openHour:"12",closeHour:"23" }); }}
            className="border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] px-6 py-3 rounded-full font-medium text-sm hover:bg-[#EDE8D0] transition-colors"
          >
            Nog een café
          </button>
        </div>
      </div>
    );
  }

  // ── Progress bar ──
  const steps = ["Jouw café", "Hoe kijken?", "Tijden", "Bevestig"];

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-0.5 rounded-full transition-colors ${
              i + 1 <= step ? "bg-[#C97A0A]" : "bg-[rgba(26,26,26,0.12)]"
            }`}
          />
        ))}
      </div>

      {/* ── Stap 1 ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C97A0A] mb-1">Stap 01 / 04</p>
            <h2 className="text-2xl font-bold leading-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-lora)" }}>
              Wat is de naam van jouw café?
            </h2>
          </div>

          <div>
            <label className="label">Naam café</label>
            <input required type="text" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="bijv. Café De Oranje Leeuw" className="input" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Straat + huisnummer</label>
              <input required type="text" value={form.address}
                onChange={(e) => { set("address", e.target.value); set("lat",""); set("lng",""); }}
                onBlur={() => { if (form.address.trim() && form.city.trim() && !form.lat) geocode(form.address, form.city); }}
                placeholder="bijv. Leidseplein 12" className="input" />
            </div>
            <div>
              <label className="label">Stad</label>
              <input required type="text" value={form.city}
                onChange={(e) => { set("city", e.target.value); set("lat",""); set("lng",""); }}
                onBlur={() => { if (form.address.trim() && form.city.trim() && !form.lat) geocode(form.address, form.city); }}
                placeholder="bijv. Amsterdam" className="input" />
            </div>
          </div>

          {/* Geocode status */}
          <div className={`rounded-xl border p-3 text-sm transition-all ${
            form.lat ? "border-[#1B4332]/30 bg-[#1B4332]/5"
            : geocodeError ? "border-red-300 bg-red-50"
            : "border-[rgba(26,26,26,0.1)] bg-white/40"
          }`}>
            {geocoding ? (
              <div className="flex items-center gap-2 text-[#7A7465] font-medium">
                <Loader2 size={14} className="animate-spin text-[#1B4332]" />
                Locatie bepalen…
              </div>
            ) : form.lat ? (
              <div className="flex items-center gap-2 text-[#1B4332] font-medium">
                <CheckCheck size={14} />
                Locatie gevonden · {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
                <button type="button" onClick={() => geocode(form.address, form.city)}
                  className="ml-auto text-xs text-[#1B4332]/60 underline hover:text-[#1B4332]">Opnieuw</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#7A7465]">
                <MapPin size={14} className="shrink-0" />
                {geocodeError || "Vul adres + stad in — locatie wordt automatisch bepaald"}
              </div>
            )}
          </div>

          <button type="button" disabled={!form.name.trim() || !form.address.trim() || !form.city.trim()}
            onClick={() => setStep(2)}
            className="w-full bg-[#1B4332] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#2D6A4F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Volgende stap →
          </button>
        </div>
      )}

      {/* ── Stap 2 ── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C97A0A] mb-1">Stap 02 / 04</p>
            <h2 className="text-2xl font-bold leading-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-lora)" }}>
              Hoe kijken jullie de{" "}
              <em className="text-[#1B4332]">wedstrijd?</em>
            </h2>
            <p className="text-sm text-[#7A7465] mt-1">
              Bezoekers willen weten waar ze terecht komen. Dit duurt 30 seconden.
            </p>
          </div>

          <div>
            <SectionLabel>Schermen</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["1","2-3","4+"] as ScreenCount[]).map((v) => (
                <PillOption key={v} active={form.screenCount===v} onClick={() => set("screenCount",v)}>
                  {v} scherm{v==="1"?"":"s"}
                </PillOption>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Grootste scherm</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              <PillOption active={form.screenSize==="klein"}  onClick={() => set("screenSize","klein")}>Klein &lt;40&quot;</PillOption>
              <PillOption active={form.screenSize==="middel"} onClick={() => set("screenSize","middel")}>Middel 40–60&quot;</PillOption>
              <PillOption active={form.screenSize==="groot"}  onClick={() => set("screenSize","groot")}>Groot 60&quot;+</PillOption>
            </div>
          </div>

          <div>
            <SectionLabel>Geluid tijdens wedstrijd</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["aan","uit","soms"] as Geluid[]).map((v) => (
                <PillOption key={v} active={form.geluid===v} onClick={() => set("geluid",v)}>
                  {v.charAt(0).toUpperCase()+v.slice(1)}
                </PillOption>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Sfeer (max 3)</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {(["bruine kroeg","sportcafé","terras","voor families","live muziek"] as Sfeer[]).map((v) => (
                <PillOption key={v} active={form.sfeer.includes(v)} onClick={() => toggleSfeer(v)}>
                  {v.charAt(0).toUpperCase()+v.slice(1)}
                </PillOption>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] w-12 py-3.5 rounded-full font-medium text-sm hover:bg-[#EDE8D0] transition-colors">←</button>
            <button type="button" onClick={() => setStep(3)}
              className="flex-1 bg-[#1B4332] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#2D6A4F] transition-colors">Volgende stap →</button>
          </div>
        </div>
      )}

      {/* ── Stap 3 ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C97A0A] mb-1">Stap 03 / 04</p>
            <h2 className="text-2xl font-bold leading-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-lora)" }}>
              Wanneer zijn jullie <em className="text-[#1B4332]">open?</em>
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
                <p className="mt-1 text-xs text-[#C97A0A] font-medium">
                  Sluit volgende dag om {pad(parseInt(form.closeHour))}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] w-12 py-3.5 rounded-full font-medium text-sm hover:bg-[#EDE8D0] transition-colors">←</button>
            <button type="button" onClick={() => setStep(4)}
              className="flex-1 bg-[#1B4332] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#2D6A4F] transition-colors">Volgende stap →</button>
          </div>
        </div>
      )}

      {/* ── Stap 4 ── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C97A0A] mb-1">Stap 04 / 04</p>
            <h2 className="text-2xl font-bold leading-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-lora)" }}>
              Klopt alles?
            </h2>
          </div>

          <div className="rounded-2xl border border-[rgba(26,26,26,0.1)] bg-white/50 divide-y divide-[rgba(26,26,26,0.07)]">
            {[
              { label:"Naam", value:form.name },
              { label:"Adres", value:`${form.address}, ${form.city}` },
              { label:"Schermen", value:form.screenCount },
              { label:"Groot scherm", value:form.screenSize },
              { label:"Geluid", value:form.geluid },
              { label:"Sfeer", value:form.sfeer.join(", ")||"—" },
              { label:"Tijden", value:`${pad(parseInt(form.openHour))} – ${pad(parseInt(form.closeHour))}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7465] w-24 shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-[#1A1A1A] font-medium">{value}</span>
              </div>
            ))}
          </div>

          {!form.lat && (
            <p className="text-xs font-medium text-red-600">⚠ Locatie nog niet bepaald — ga terug naar stap 1</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(3)}
              className="border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] w-12 py-3.5 rounded-full font-medium text-sm hover:bg-[#EDE8D0] transition-colors">←</button>
            <button type="button" disabled={submitting||!form.lat} onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1B4332] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#2D6A4F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {submitting ? <><Loader2 size={15} className="animate-spin"/>Toevoegen…</> : "Indienen →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
