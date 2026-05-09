import Link from "next/link";
import AanmeldenForm from "./AanmeldenForm";

export const metadata = {
  title: "Café aanmelden — Tap & Trap",
};

export default function AanmeldenPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[#2A2A2A] bg-[#0D0D0D] px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center border border-[#2A2A2A] text-white/50 hover:border-[#F5A800] hover:text-[#F5A800] transition-colors text-lg font-black"
          >
            ←
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5A800]">
              Meld je café aan
            </p>
            <h1 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
              Tap &amp; Trap
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-lg px-4 py-6">
        <AanmeldenForm />
      </div>
    </div>
  );
}
