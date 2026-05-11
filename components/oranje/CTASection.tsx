import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#a93100] py-16 md:py-20">
      {/* Skewed accent layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3f2c26]/40 to-transparent" />
      <div
        className="absolute -right-20 top-0 h-full w-1/3 bg-[#d34000]/40"
        style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
            Café-eigenaar?
          </p>
          <h2
            className="text-3xl md:text-4xl font-black text-white leading-tight max-w-lg"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Zet jouw café op de kaart van Nederland.
          </h2>
          <p className="text-white/80 mt-3 max-w-md leading-relaxed" style={{ fontFamily: "var(--font-lexend)" }}>
            Duizenden fans zoeken een café om Oranje te kijken. Meld je gratis aan en zorg dat ze jou vinden.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/oranje/aanmelden"
            className="bg-white text-[#a93100] font-black text-base px-7 py-4 rounded-full hover:bg-[#fff8f6] transition-colors text-center shadow-lg"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Café aanmelden →
          </Link>
          <Link
            href="/oranje/zoek"
            className="bg-white/10 border border-white/30 text-white font-semibold text-sm px-6 py-4 rounded-full hover:bg-white/20 transition-colors text-center"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Cafés zoeken
          </Link>
        </div>
      </div>
    </section>
  );
}
