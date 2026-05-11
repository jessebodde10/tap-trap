"use client";

import { useEffect, useState } from "react";

// WK 2026 – Nederland speelt in Groep F
// Wedstrijden (NL-tijd = CEST, UTC+2):
//   1. NED — JPN  zo 14 jun 22:00 CEST  (Dallas)
//   2. NED — ZWE  za 20 jun 19:00 CEST  (Houston)
//   3. TUN — NED  vr 26 jun 01:00 CEST  (Kansas City)  ← nachtelijk

const MATCHES = [
  { date: new Date("2026-06-14T22:00:00+02:00"), label: "NED — JPN", flag: "🇯🇵", time: "22:00", venue: "Dallas" },
  { date: new Date("2026-06-20T19:00:00+02:00"), label: "NED — ZWE", flag: "🇸🇪", time: "19:00", venue: "Houston" },
  { date: new Date("2026-06-26T01:00:00+02:00"), label: "TUN — NED", flag: "🇹🇳", time: "01:00", venue: "Kansas City" },
];

function getNextMatch() {
  const now = Date.now();
  return MATCHES.find((m) => m.date.getTime() > now) ?? MATCHES[MATCHES.length - 1];
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function MatchCountdownWidget() {
  const match = getNextMatch();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(match.date));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(match.date)), 1000);
    return () => clearInterval(id);
  }, [match.date]);

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-4 inline-flex flex-col gap-3 min-w-[260px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60" style={{ fontFamily: "var(--font-lexend)" }}>
          Volgende wedstrijd
        </span>
        <span className="text-[10px] font-bold bg-[#a93100] text-white px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ fontFamily: "var(--font-lexend)" }}>
          {match.time} · {match.venue}
        </span>
      </div>

      {/* Match */}
      <p className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-anybody)" }}>
        {match.label}
      </p>

      {/* Countdown */}
      <div className="flex items-end gap-3">
        {[
          { val: timeLeft.days,    label: "dagen" },
          { val: timeLeft.hours,   label: "uur"   },
          { val: timeLeft.minutes, label: "min"   },
          { val: timeLeft.seconds, label: "sec"   },
        ].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="text-3xl font-black text-white leading-none tabular-nums"
              style={{ fontFamily: "var(--font-anybody)" }}
            >
              {String(val).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-wide mt-0.5" style={{ fontFamily: "var(--font-lexend)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
