import Link from "next/link";
import AanmeldenForm from "./AanmeldenForm";

export const metadata = {
  title: "Café aanmelden — Tap & Trap",
};

export default function AanmeldenPage() {
  return (
    <div className="min-h-screen bg-[#F2EDD8]">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F2EDD8] border-b border-[rgba(26,26,26,0.1)] px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(26,26,26,0.2)] text-[#1A1A1A] hover:bg-[#EDE8D0] transition-colors"
          >
            ←
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C97A0A]">
              Meld je café aan
            </p>
            <h1 className="text-base font-semibold text-[#1A1A1A] leading-tight">
              Tap <span style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontWeight: 700 }}>&amp;Trap</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="md:grid md:grid-cols-2 md:gap-16 md:items-start">

          {/* Left — info kolom (desktop only) */}
          <div className="hidden md:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C97A0A] mb-3">
              Waarom aanmelden?
            </p>
            <h2
              className="text-4xl font-bold text-[#1A1A1A] leading-tight mb-4"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Zet jouw café<br />
              <em className="text-[#1B4332]">op de kaart.</em>
            </h2>
            <p className="text-sm text-[#7A7465] leading-relaxed mb-8">
              Duizenden voetbalfans zoeken tijdens het WK een goed café om de wedstrijd te kijken. Meld je aan en zorg dat jouw café gevonden wordt.
            </p>

            <div className="space-y-4">
              {[
                { icon: "📺", title: "Meer bezoekers", desc: "Fans filteren op groot scherm, openingstijden en locatie." },
                { icon: "📍", title: "Gratis zichtbaarheid", desc: "Jouw café verschijnt direct op de kaart en in de lijst." },
                { icon: "⚡", title: "In 2 minuten klaar", desc: "Vul de 4 stappen in — wij regelen de rest." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{title}</p>
                    <p className="text-xs text-[#7A7465] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decoratief scheidingselement */}
            <div className="mt-10 pt-8 border-t border-[rgba(26,26,26,0.1)]">
              <p className="text-xs text-[#7A7465]">
                Al <strong className="text-[#1A1A1A]">34 cafés</strong> aangemeld voor WK 2026
              </p>
            </div>
          </div>

          {/* Right — formulier */}
          <div>
            <AanmeldenForm />
          </div>

        </div>
      </div>
    </div>
  );
}
