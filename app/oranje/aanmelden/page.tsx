"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Monitor, TreePine, Volume2, Upload } from "lucide-react";
import TopNavBar from "@/components/oranje/TopNavBar";
import OranjeFooter from "@/components/oranje/OranjeFooter";

// Step types
interface FormData {
  // Step 1 — Café info
  name: string;
  address: string;
  city: string;
  openHour: string;
  closeHour: string;
  // Step 2 — Matches
  matchDays: string[];
  // Step 3 — Voorzieningen
  screens: string;
  hasLargeScreen: boolean;
  hasTerrace: boolean;
  hasSound: boolean;
  atmosphere: "" | "druk" | "gezellig" | "rustig";
  // Step 4 — Photo / contact
  contactName: string;
  contactEmail: string;
  agreeTerms: boolean;
}

const INITIAL: FormData = {
  name: "", address: "", city: "", openHour: "11", closeHour: "2",
  matchDays: [],
  screens: "2", hasLargeScreen: false, hasTerrace: false, hasSound: true, atmosphere: "gezellig",
  contactName: "", contactEmail: "", agreeTerms: false,
};

const MATCH_DAYS = [
  { key: "vr", label: "Vrijdag" },
  { key: "za", label: "Zaterdag" },
  { key: "zo", label: "Zondag" },
  { key: "ma", label: "Maandag" },
  { key: "di", label: "Dinsdag" },
  { key: "wo", label: "Woensdag" },
  { key: "do", label: "Donderdag" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function PillToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
        active
          ? "bg-[#a93100] text-white border-[#a93100]"
          : "bg-transparent text-[#3f2c26] border-[rgba(169,49,0,0.3)] hover:border-[#a93100]"
      }`}
      style={{ fontFamily: "var(--font-lexend)" }}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-1.5" style={{ fontFamily: "var(--font-lexend)" }}>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] placeholder-[#7a5c55]/50 outline-none focus:border-[#a93100] focus:ring-2 focus:ring-[#a93100]/10 transition-colors"
      style={{ fontFamily: "var(--font-lexend)" }}
    />
  );
}

const STEPS = [
  { label: "Café info" },
  { label: "Wedstrijden" },
  { label: "Voorzieningen" },
  { label: "Afronden" },
];

export default function OranjeAanmeldenPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleMatchDay(day: string) {
    set("matchDays", form.matchDays.includes(day)
      ? form.matchDays.filter((d) => d !== day)
      : [...form.matchDays, day]);
  }

  function canProceed(): boolean {
    if (step === 0) return !!form.name.trim() && !!form.address.trim() && !!form.city.trim();
    if (step === 1) return form.matchDays.length > 0;
    if (step === 2) return !!form.screens;
    if (step === 3) return !!form.contactName.trim() && !!form.contactEmail.trim() && form.agreeTerms;
    return true;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fff8f6] flex flex-col pt-[72px]">
        <TopNavBar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#a93100] flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-[#3f2c26] mb-3" style={{ fontFamily: "var(--font-anybody)" }}>
              Aanmelding ontvangen!
            </h1>
            <p className="text-[#7a5c55] leading-relaxed mb-8" style={{ fontFamily: "var(--font-lexend)" }}>
              Bedankt voor het aanmelden van <strong className="text-[#3f2c26]">{form.name}</strong>. We verwerken je aanmelding en zetten het café zo snel mogelijk op de kaart.
            </p>
            <Link
              href="/oranje"
              className="inline-flex items-center gap-2 bg-[#a93100] text-white font-black px-7 py-3.5 rounded-full hover:bg-[#d34000] transition-colors"
              style={{ fontFamily: "var(--font-anybody)" }}
            >
              Naar de homepage →
            </Link>
          </div>
        </div>
        <OranjeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6] flex flex-col pt-[72px]">
      <TopNavBar />

      <div className="mx-auto w-full max-w-2xl px-4 md:px-8 py-8 flex-1">

        {/* Back link */}
        <Link
          href="/oranje"
          className="inline-flex items-center gap-1.5 text-sm text-[#7a5c55] hover:text-[#a93100] transition-colors mb-6"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          <ArrowLeft size={14} /> Terug
        </Link>

        {/* Title */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a93100] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
            Stap {step + 1} van {STEPS.length}
          </p>
          <h1 className="text-3xl font-black text-[#3f2c26]" style={{ fontFamily: "var(--font-anybody)" }}>
            Café aanmelden
          </h1>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  i <= step ? "bg-[#a93100]" : "bg-[rgba(169,49,0,0.15)]"
                }`}
              />
              <p className={`text-[10px] font-medium hidden md:block ${i === step ? "text-[#a93100]" : "text-[#7a5c55]/60"}`} style={{ fontFamily: "var(--font-lexend)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-[rgba(169,49,0,0.12)] shadow-sm p-6 md:p-8">

          {/* STEP 0 — Café info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#3f2c26] mb-6" style={{ fontFamily: "var(--font-anybody)" }}>
                Hoe heet{" "}
                <em className="text-[#a93100]" style={{ fontFamily: "var(--font-anybody)" }}>jouw café?</em>
              </h2>

              <div>
                <FieldLabel>Naam van het café *</FieldLabel>
                <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="Café De Kroeg" />
              </div>
              <div>
                <FieldLabel>Adres *</FieldLabel>
                <TextInput value={form.address} onChange={(v) => set("address", v)} placeholder="Hoofdstraat 1" />
              </div>
              <div>
                <FieldLabel>Stad *</FieldLabel>
                <TextInput value={form.city} onChange={(v) => set("city", v)} placeholder="Amsterdam" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Opent om</FieldLabel>
                  <select
                    value={form.openHour}
                    onChange={(e) => set("openHour", e.target.value)}
                    className="w-full bg-white border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] outline-none focus:border-[#a93100]"
                    style={{ fontFamily: "var(--font-lexend)" }}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Sluit om</FieldLabel>
                  <select
                    value={form.closeHour}
                    onChange={(e) => set("closeHour", e.target.value)}
                    className="w-full bg-white border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] outline-none focus:border-[#a93100]"
                    style={{ fontFamily: "var(--font-lexend)" }}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Match days */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-[#3f2c26] mb-6" style={{ fontFamily: "var(--font-anybody)" }}>
                Op welke dagen zendt{" "}
                <em className="text-[#a93100]">je de wedstrijden uit?</em>
              </h2>
              <p className="text-sm text-[#7a5c55] -mt-3" style={{ fontFamily: "var(--font-lexend)" }}>
                Selecteer alle dagen waarop fans welkom zijn.
              </p>
              <div className="flex flex-wrap gap-2">
                {MATCH_DAYS.map(({ key, label }) => (
                  <PillToggle
                    key={key}
                    active={form.matchDays.includes(key)}
                    onClick={() => toggleMatchDay(key)}
                  >
                    {label}
                  </PillToggle>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Voorzieningen */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-[#3f2c26] mb-6" style={{ fontFamily: "var(--font-anybody)" }}>
                Wat heeft{" "}
                <em className="text-[#a93100]">jouw café te bieden?</em>
              </h2>

              <div>
                <FieldLabel>Aantal schermen *</FieldLabel>
                <div className="flex gap-2">
                  {["1", "2", "3", "4", "5+"].map((n) => (
                    <PillToggle key={n} active={form.screens === n} onClick={() => set("screens", n)}>
                      {n}
                    </PillToggle>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "hasLargeScreen" as const, icon: <Monitor size={16} />, label: "Groot scherm (projectie / 75″+)" },
                  { key: "hasTerrace" as const, icon: <TreePine size={16} />, label: "Terras aanwezig" },
                  { key: "hasSound" as const, icon: <Volume2 size={16} />, label: "Geluid aan tijdens wedstrijden" },
                ].map(({ key, icon, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        form[key]
                          ? "bg-[#a93100] border-[#a93100]"
                          : "border-[rgba(169,49,0,0.3)] group-hover:border-[#a93100]"
                      }`}
                      onClick={() => set(key, !form[key] as FormData[typeof key])}
                    >
                      {form[key] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex items-center gap-2 text-sm select-none ${form[key] ? "text-[#3f2c26]" : "text-[#7a5c55]"}`} style={{ fontFamily: "var(--font-lexend)" }} onClick={() => set(key, !form[key] as FormData[typeof key])}>
                      <span className={form[key] ? "text-[#a93100]" : "text-[#7a5c55]/50"}>{icon}</span>
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <FieldLabel>Sfeer</FieldLabel>
                <div className="flex gap-2">
                  {(["druk", "gezellig", "rustig"] as const).map((v) => (
                    <PillToggle key={v} active={form.atmosphere === v} onClick={() => set("atmosphere", v)}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </PillToggle>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Contact + submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#3f2c26] mb-6" style={{ fontFamily: "var(--font-anybody)" }}>
                Bijna klaar —{" "}
                <em className="text-[#a93100]">contactgegevens.</em>
              </h2>

              <div>
                <FieldLabel>Jouw naam *</FieldLabel>
                <TextInput value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="Jan de Vries" />
              </div>
              <div>
                <FieldLabel>E-mailadres *</FieldLabel>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="jan@cafedekroeg.nl"
                  className="w-full bg-white border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] placeholder-[#7a5c55]/50 outline-none focus:border-[#a93100] focus:ring-2 focus:ring-[#a93100]/10 transition-colors"
                  style={{ fontFamily: "var(--font-lexend)" }}
                />
              </div>

              {/* Photo upload placeholder */}
              <div>
                <FieldLabel>Foto van het café (optioneel)</FieldLabel>
                <div className="border-2 border-dashed border-[rgba(169,49,0,0.2)] rounded-xl p-6 text-center hover:border-[#a93100] transition-colors cursor-pointer">
                  <Upload size={20} className="mx-auto text-[#7a5c55] mb-2" />
                  <p className="text-sm text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
                    Slepen of klikken om te uploaden
                  </p>
                  <p className="text-xs text-[#7a5c55]/60 mt-1" style={{ fontFamily: "var(--font-lexend)" }}>
                    JPG, PNG, max 5 MB
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-[#fff8f6] rounded-xl p-4 border border-[rgba(169,49,0,0.1)]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
                  Samenvatting
                </p>
                <p className="text-sm font-semibold text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
                  {form.name || "—"}
                </p>
                <p className="text-xs text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
                  {form.city} · {form.screens} scherm(en) · {form.matchDays.join(", ")}
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    form.agreeTerms ? "bg-[#a93100] border-[#a93100]" : "border-[rgba(169,49,0,0.3)]"
                  }`}
                  onClick={() => set("agreeTerms", !form.agreeTerms)}
                >
                  {form.agreeTerms && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm text-[#7a5c55] select-none"
                  style={{ fontFamily: "var(--font-lexend)" }}
                  onClick={() => set("agreeTerms", !form.agreeTerms)}
                >
                  Ik ga akkoord met de{" "}
                  <span className="text-[#a93100] underline cursor-pointer">algemene voorwaarden</span>{" "}
                  van OranjeKijkers.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-end gap-2 mt-6">
          {showError && (
            <p className="text-xs text-[#a93100] font-medium" style={{ fontFamily: "var(--font-lexend)" }}>
              {step === 0 && "Vul naam, adres en stad in om door te gaan."}
              {step === 1 && "Selecteer minstens één wedstrijddag."}
              {step === 2 && "Kies het aantal schermen."}
              {step === 3 && "Vul je naam, e-mail in en ga akkoord met de voorwaarden."}
            </p>
          )}
          <div className="flex justify-between w-full">
            <button
              type="button"
              onClick={() => { setStep((s) => s - 1); setShowError(false); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border border-[rgba(169,49,0,0.25)] text-[#3f2c26] hover:border-[#a93100] transition-colors ${step === 0 ? "invisible" : ""}`}
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              <ArrowLeft size={14} /> Vorige
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (canProceed()) { setStep((s) => s + 1); setShowError(false); }
                  else setShowError(true);
                }}
                className="flex items-center gap-2 bg-[#a93100] hover:bg-[#d34000] text-white font-black px-6 py-3 rounded-full transition-colors"
                style={{ fontFamily: "var(--font-anybody)" }}
              >
                Volgende <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (canProceed()) setSubmitted(true);
                  else setShowError(true);
                }}
                className="flex items-center gap-2 bg-[#a93100] hover:bg-[#d34000] text-white font-black px-6 py-3 rounded-full transition-colors"
                style={{ fontFamily: "var(--font-anybody)" }}
              >
                Aanmelden <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <OranjeFooter />
    </div>
  );
}
