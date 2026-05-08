"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock } from "lucide-react";

const MATCH_DATE = new Date("2026-06-14T19:00:00Z");

function useCountdown(target: Date) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setLabel("Bezig!"); return; }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      if (d > 0) setLabel(`${d} dag${d !== 1 ? "en" : ""} · ${h}u`);
      else if (h > 0) setLabel(`${h} uur · ${m}m`);
      else setLabel(`${m} min`);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [target]);

  return label;
}

export default function MatchBanner() {
  const countdown = useCountdown(MATCH_DATE);

  return (
    <div className="flex items-center justify-between bg-orange-500 px-4 py-1.5 text-sm text-white">
      <div className="flex items-center gap-2 font-medium">
        <Trophy size={13} />
        <span>Nederland</span>
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs font-bold">VS</span>
        <span>Japan</span>
        <span className="hidden opacity-75 sm:inline text-xs">· 14 juni 2026 · 21:00</span>
      </div>
      {countdown && (
        <div className="flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-1 text-xs">
          <Clock size={11} />
          {countdown}
        </div>
      )}
    </div>
  );
}
