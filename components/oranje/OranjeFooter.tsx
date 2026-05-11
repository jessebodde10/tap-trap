"use client";

import Link from "next/link";

export default function OranjeFooter() {
  return (
    <footer className="bg-[#3f2c26] text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <p
            className="text-2xl font-black mb-3"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            <span className="text-[#d34000]">Oranje</span>Kijkers
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-lexend)" }}>
            De grootste gids voor Oranje-cafés tijdens het WK 2026. Vind het perfecte café, reserveer een plek en beleef de wedstrijd samen.
          </p>
          <div className="flex gap-3 mt-5">
            {["𝕏", "f", "in"].map((icon) => (
              <span
                key={icon}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-[#a93100] transition-colors"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d34000] mb-4" style={{ fontFamily: "var(--font-lexend)" }}>
            Navigatie
          </p>
          <ul className="space-y-2.5">
            {[
              { href: "/oranje", label: "Home" },
              { href: "/oranje/zoek", label: "Cafés vinden" },
              { href: "/oranje/aanmelden", label: "Café aanmelden" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-lexend)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d34000] mb-4" style={{ fontFamily: "var(--font-lexend)" }}>
            Blijf op de hoogte
          </p>
          <p className="text-sm text-white/60 mb-4 leading-relaxed" style={{ fontFamily: "var(--font-lexend)" }}>
            Ontvang de wedstrijdagenda en nieuwe cafés direct in je inbox.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="jouw@email.nl"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#d34000] transition-colors"
              style={{ fontFamily: "var(--font-lexend)" }}
            />
            <button
              type="submit"
              className="bg-[#a93100] hover:bg-[#d34000] transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-full shrink-0"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              OK
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 md:px-8 py-5">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-lexend)" }}>
            © 2026 OranjeKijkers. WK 2026 is van 11 juni t/m 19 juli.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Voorwaarden", "Contact"].map((t) => (
              <span key={t} className="text-xs text-white/40 hover:text-white/70 cursor-pointer transition-colors" style={{ fontFamily: "var(--font-lexend)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
