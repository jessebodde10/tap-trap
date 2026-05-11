"use client";

import Link from "next/link";
import { oranjeCafes } from "@/data/oranje-cafes";
import { MapPin, Star } from "lucide-react";

export default function FeaturedCafesBentoGrid() {
  const [main, ...rest] = oranjeCafes.slice(0, 4);

  return (
    <section className="bg-[#fff8f6] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a93100] mb-2" style={{ fontFamily: "var(--font-lexend)" }}>
              Uitgelicht
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-[#3f2c26]"
              style={{ fontFamily: "var(--font-anybody)" }}
            >
              Populaire cafés
            </h2>
          </div>
          <Link
            href="/oranje/zoek"
            className="hidden md:inline-flex text-sm font-semibold text-[#a93100] hover:text-[#d34000] transition-colors items-center gap-1"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Alle cafés bekijken →
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-auto md:h-[460px]">

          {/* Main card — col-span-2 row-span-2 */}
          <Link
            href={`/oranje/cafe/${main.id}`}
            className={`col-span-2 row-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br ${main.gradient} group`}
          >
            <img
              src={main.imageUrl}
              alt={main.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              {main.isLive && (
                <span className="inline-flex items-center gap-1.5 bg-[#a93100] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Live nu
                </span>
              )}
              <p
                className="text-2xl md:text-3xl font-black text-white leading-tight mb-1 group-hover:text-[#ffd4c8] transition-colors"
                style={{ fontFamily: "var(--font-anybody)" }}
              >
                {main.name}
              </p>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-lexend)" }}>
                  <MapPin size={12} />
                  {main.city}
                </span>
                <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-lexend)" }}>
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  {main.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>

          {/* Smaller cards */}
          {rest.map((cafe) => (
            <Link
              key={cafe.id}
              href={`/oranje/cafe/${cafe.id}`}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${cafe.gradient} group`}
            >
              <img
                src={cafe.imageUrl}
                alt={cafe.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 md:p-4">
                <p
                  className="text-sm md:text-base font-black text-white leading-tight group-hover:text-[#ffd4c8] transition-colors"
                  style={{ fontFamily: "var(--font-anybody)" }}
                >
                  {cafe.name}
                </p>
                <p className="text-[11px] text-white/60 flex items-center gap-1 mt-0.5" style={{ fontFamily: "var(--font-lexend)" }}>
                  <MapPin size={10} />
                  {cafe.city}
                </p>
              </div>
              {cafe.isLive && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d34000] animate-pulse" />
              )}
            </Link>
          ))}
        </div>

        <div className="mt-5 md:hidden text-center">
          <Link
            href="/oranje/zoek"
            className="inline-flex text-sm font-semibold text-[#a93100] hover:text-[#d34000] transition-colors"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Alle cafés bekijken →
          </Link>
        </div>
      </div>
    </section>
  );
}
