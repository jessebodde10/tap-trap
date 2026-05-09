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
        <div className="mx-auto flex max-w-lg items-center gap-3">
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
              Tap &amp;<span style={{ fontFamily: "var(--font-lora)", fontStyle: "italic" }}>Trap</span>
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
