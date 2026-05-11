import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Monitor, TreePine, Volume2, Star, ArrowLeft, Clock } from "lucide-react";
import { getCafeById, oranjeCafes } from "@/data/oranje-cafes";
import TopNavBar from "@/components/oranje/TopNavBar";
import OranjeFooter from "@/components/oranje/OranjeFooter";
import CafeHeroImage from "@/components/oranje/CafeHeroImage";
import ReserveButton from "@/components/oranje/ReserveButton";

// WK 2026 wedstrijdschema — NL-tijd (CEST, UTC+2)
// Nederland speelt in Groep F met Japan, Zweden en Tunesië
const matchSchedule = [
  { date: "do 11 jun", time: "21:00", match: "Opening: Mexico — Zuid-Afrika",    group: "Groep A · Ciudad de México" },
  { date: "zo 14 jun", time: "22:00", match: "Nederland — Japan",               group: "Groep F · Dallas" },
  { date: "za 20 jun", time: "19:00", match: "Nederland — Zweden",              group: "Groep F · Houston" },
  { date: "vr 26 jun", time: "01:00", match: "Tunesië — Nederland",             group: "Groep F · Kansas City" },
  { date: "ma 29 jun", time: "19:00", match: "Achtste finale (NED bij 2e plek)", group: "Knock-out · Houston" },
  { date: "vr 10 jul", time: "TBD",   match: "Kwartfinale",                     group: "Knock-out" },
  { date: "di 14 jul", time: "TBD",   match: "Halve finale",                    group: "Knock-out" },
  { date: "zo 19 jul", time: "21:00", match: "WK Finale",                       group: "MetLife Stadium · New York" },
];

const mockReviews = [
  { author: "Sander V.", rating: 5, text: "Geweldige sfeer, groot scherm, goede bediening. Wij gaan hier elk WK-duel kijken!", date: "2 jun 2026" },
  { author: "Lisa de B.", rating: 4, text: "Druk maar gezellig. Tip: kom 30 min voor de wedstrijd voor een goede plek.", date: "28 mei 2026" },
  { author: "Kees M.", rating: 5, text: "Beste WK-café van de stad. Scherm is enorm en het geluid staat altijd aan.", date: "15 mei 2026" },
];

function pad(h: number) {
  return String(h).padStart(2, "0") + ":00";
}

function isOpenNow(openHour: number, closeHour: number): boolean {
  const h = new Date().getHours();
  if (closeHour > openHour) return h >= openHour && h < closeHour;
  return h >= openHour || h < closeHour;
}

export async function generateStaticParams() {
  return oranjeCafes.map((c) => ({ id: c.id }));
}

export default async function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cafe = getCafeById(id);
  if (!cafe) notFound();

  const open = isOpenNow(cafe.openHour, cafe.closeHour);
  const avgRating = cafe.rating;

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <TopNavBar />

      {/* Hero */}
      <div className={`h-64 md:h-80 bg-gradient-to-br ${cafe.gradient} relative overflow-hidden`}>
        <CafeHeroImage src={cafe.imageUrl} alt={cafe.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4 md:left-8">
          <Link
            href="/oranje/zoek"
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white text-sm font-medium px-3 py-2 rounded-full transition-colors backdrop-blur-sm"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            <ArrowLeft size={15} /> Terug
          </Link>
        </div>

        {/* Live badge */}
        {cafe.isLive && (
          <span className="absolute top-20 right-4 md:right-8 flex items-center gap-1.5 bg-[#a93100] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide" style={{ fontFamily: "var(--font-lexend)" }}>
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Nu live
          </span>
        )}

        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ffd4c8] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
            {cafe.hasTerrace ? "Terras" : "Café"} · {cafe.city}
          </p>
          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            {cafe.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="md:col-span-2 space-y-8">

            {/* Info chips */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  open ? "bg-[#a93100]/10 text-[#a93100]" : "bg-[rgba(169,49,0,0.08)] text-[#7a5c55]"
                }`}
                style={{ fontFamily: "var(--font-lexend)" }}
              >
                <Clock size={12} />
                {open ? `Open · tot ${pad(cafe.closeHour)}` : `Gesloten · opent ${pad(cafe.openHour)}`}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(169,49,0,0.08)] text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
                <MapPin size={12} />
                {cafe.address}
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700" style={{ fontFamily: "var(--font-lexend)" }}>
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {avgRating.toFixed(1)} ({cafe.reviewCount} reviews)
              </span>
            </div>

            {/* Facilities grid */}
            <div>
              <h2 className="text-lg font-black text-[#3f2c26] mb-4" style={{ fontFamily: "var(--font-anybody)" }}>
                Voorzieningen
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Monitor size={16} />, label: "Schermen", value: `${cafe.screens}× ${cafe.hasLargeScreen ? "groot" : "normaal"}` },
                  { icon: <TreePine size={16} />, label: "Terras", value: cafe.hasTerrace ? "Aanwezig" : "Niet aanwezig", dim: !cafe.hasTerrace },
                  { icon: <Volume2 size={16} />, label: "Geluid", value: cafe.hasSound ? "Aan tijdens wedstrijd" : "Geen geluid", dim: !cafe.hasSound },
                  { icon: <Clock size={16} />, label: "Openingstijden", value: `${pad(cafe.openHour)} – ${pad(cafe.closeHour)}` },
                ].map(({ icon, label, value, dim }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-[rgba(169,49,0,0.1)]">
                    <div className={`flex items-center gap-2 mb-1.5 ${dim ? "text-[#7a5c55]/50" : "text-[#a93100]"}`}>
                      {icon}
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
                        {label}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${dim ? "text-[#7a5c55]" : "text-[#3f2c26]"}`} style={{ fontFamily: "var(--font-lexend)" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Match schedule */}
            <div>
              <h2 className="text-lg font-black text-[#3f2c26] mb-4" style={{ fontFamily: "var(--font-anybody)" }}>
                Wedstrijden dit café uitzendt
              </h2>
              <div className="space-y-2">
                {matchSchedule.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 border border-[rgba(169,49,0,0.1)]"
                  >
                    <div className="text-center shrink-0 w-16">
                      <p className="text-[10px] font-semibold text-[#7a5c55] uppercase tracking-wide" style={{ fontFamily: "var(--font-lexend)" }}>
                        {m.date}
                      </p>
                      <p className="text-sm font-black text-[#a93100]" style={{ fontFamily: "var(--font-anybody)" }}>
                        {m.time}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
                        {m.match}
                      </p>
                      <p className="text-xs text-[#7a5c55]" style={{ fontFamily: "var(--font-lexend)" }}>
                        {m.group}
                      </p>
                    </div>
                    {m.time !== "TBD" ? (
                      <span className="text-xs bg-[#a93100]/10 text-[#a93100] font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ fontFamily: "var(--font-lexend)" }}>
                        Live
                      </span>
                    ) : (
                      <span className="text-xs bg-[rgba(169,49,0,0.06)] text-[#7a5c55] font-medium px-2.5 py-1 rounded-full shrink-0 border border-[rgba(169,49,0,0.12)]" style={{ fontFamily: "var(--font-lexend)" }}>
                        Datum volgt
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-black text-[#3f2c26] mb-4" style={{ fontFamily: "var(--font-anybody)" }}>
                Reviews
              </h2>
              <div className="space-y-3">
                {mockReviews.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-[rgba(169,49,0,0.1)]">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-[#3f2c26]" style={{ fontFamily: "var(--font-lexend)" }}>
                        {r.author}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            size={12}
                            className={s < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#7a5c55] leading-relaxed" style={{ fontFamily: "var(--font-lexend)" }}>
                      {r.text}
                    </p>
                    <p className="text-xs text-[#7a5c55]/60 mt-2" style={{ fontFamily: "var(--font-lexend)" }}>
                      {r.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sticky booking card */}
          <div className="md:sticky md:top-24 self-start">
            <div className="bg-white rounded-2xl border border-[rgba(169,49,0,0.15)] shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${cafe.gradient}`} />
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a93100] mb-1" style={{ fontFamily: "var(--font-lexend)" }}>
                  Reserveer een plek
                </p>
                <p className="text-xl font-black text-[#3f2c26] mb-4" style={{ fontFamily: "var(--font-anybody)" }}>
                  {cafe.name}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-1.5" style={{ fontFamily: "var(--font-lexend)" }}>
                      Wedstrijd
                    </label>
                    <select className="w-full bg-[#fff8f6] border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] outline-none focus:border-[#a93100]" style={{ fontFamily: "var(--font-lexend)" }}>
                      {matchSchedule.map((m, i) => (
                        <option key={i}>{m.match} — {m.date}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-1.5" style={{ fontFamily: "var(--font-lexend)" }}>
                      Aantal personen
                    </label>
                    <select className="w-full bg-[#fff8f6] border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] outline-none focus:border-[#a93100]" style={{ fontFamily: "var(--font-lexend)" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n}>{n} {n === 1 ? "persoon" : "personen"}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#7a5c55] mb-1.5" style={{ fontFamily: "var(--font-lexend)" }}>
                      Naam
                    </label>
                    <input
                      type="text"
                      placeholder="Jouw naam"
                      className="w-full bg-[#fff8f6] border border-[rgba(169,49,0,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#3f2c26] placeholder-[#7a5c55]/60 outline-none focus:border-[#a93100]"
                      style={{ fontFamily: "var(--font-lexend)" }}
                    />
                  </div>
                </div>

                <ReserveButton cafeName={cafe.name} />

                <p className="text-center text-xs text-[#7a5c55] mt-3" style={{ fontFamily: "var(--font-lexend)" }}>
                  Gratis · Geen creditcard nodig
                </p>
              </div>
            </div>

            {/* Route button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + " " + cafe.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full bg-white border border-[rgba(169,49,0,0.2)] text-[#3f2c26] font-semibold text-sm py-3 rounded-full hover:bg-[#fff8f6] transition-colors"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              <MapPin size={15} className="text-[#a93100]" />
              Routebeschrijving
            </a>
          </div>
        </div>
      </div>

      <OranjeFooter />
    </div>
  );
}
