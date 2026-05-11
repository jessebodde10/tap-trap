"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import MatchCountdownWidget from "./MatchCountdownWidget";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/oranje/zoek?stad=${encodeURIComponent(city.trim())}`);
    } else {
      router.push("/oranje/zoek");
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#3f2c26] min-h-[540px] flex items-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#a93100]/80 via-[#3f2c26]/60 to-[#1a0e0b]" />

      {/* Decorative orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#d34000]/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#a93100]/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">

        {/* Left — copy */}
        <div>
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#d34000] bg-[#d34000]/10 border border-[#d34000]/30 rounded-full px-3 py-1 mb-5"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            WK 2026 · 11 jun – 19 jul
          </span>
          <h1
            className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-5"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Beleef<br />
            <span className="text-[#d34000]">Oranje</span><br />
            samen.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md" style={{ fontFamily: "var(--font-lexend)" }}>
            Vind het perfecte café bij jou in de buurt. Groot scherm, koud bier en duizenden medefans — alles op één plek.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Zoek jouw stad…"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:border-[#d34000] focus:bg-white/15 transition-colors"
                style={{ fontFamily: "var(--font-lexend)" }}
              />
            </div>
            <button
              type="submit"
              className="bg-[#a93100] hover:bg-[#d34000] text-white rounded-full px-5 py-3 text-sm font-semibold transition-colors shrink-0"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              Zoeken
            </button>
          </form>
        </div>

        {/* Right — countdown widget */}
        <div className="flex justify-center md:justify-end">
          <MatchCountdownWidget />
        </div>
      </div>
    </section>
  );
}
