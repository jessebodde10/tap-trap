"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/oranje", label: "Home" },
  { href: "/oranje/zoek", label: "Cafés vinden" },
  { href: "/oranje/aanmelden", label: "Café aanmelden" },
];

export default function TopNavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-5xl pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-md border border-[rgba(169,49,0,0.12)] shadow-lg shadow-[rgba(169,49,0,0.06)] rounded-2xl px-4 md:px-5 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/oranje" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl font-black text-[#a93100] leading-none"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Oranje
          </span>
          <span
            className="text-xl font-black text-[#3f2c26] leading-none"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Kijkers
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[#a93100]/10 text-[#a93100]"
                  : "text-[#3f2c26]/70 hover:text-[#a93100] hover:bg-[#a93100]/5"
              }`}
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/oranje/aanmelden"
            className="bg-[#a93100] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#d34000] transition-colors"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Aanmelden
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#3f2c26] hover:bg-[#a93100]/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-[rgba(169,49,0,0.12)] shadow-lg rounded-2xl px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[#a93100]/10 text-[#a93100]"
                  : "text-[#3f2c26] hover:bg-[#a93100]/5"
              }`}
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/oranje/aanmelden"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#a93100] text-white text-sm font-semibold px-5 py-3 rounded-full text-center hover:bg-[#d34000] transition-colors"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Café aanmelden
          </Link>
        </div>
      )}
      </div>
    </header>
  );
}
