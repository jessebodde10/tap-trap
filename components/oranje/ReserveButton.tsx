"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface Props {
  cafeName: string;
}

export default function ReserveButton({ cafeName }: Props) {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleReserve() {
    setStatus("success");
    // Reset after 4 seconds
    setTimeout(() => setStatus("idle"), 4000);
  }

  if (status === "success") {
    return (
      <div className="w-full flex items-center justify-center gap-2 bg-[#1a6b2e] text-white font-black py-3.5 rounded-full text-base animate-in fade-in duration-300"
        style={{ fontFamily: "var(--font-anybody)" }}>
        <Check size={18} />
        Reservering ontvangen!
      </div>
    );
  }

  return (
    <button
      onClick={handleReserve}
      className="w-full bg-[#a93100] hover:bg-[#d34000] text-white font-black py-3.5 rounded-full transition-colors text-base"
      style={{ fontFamily: "var(--font-anybody)" }}
    >
      Reserveer nu →
    </button>
  );
}
