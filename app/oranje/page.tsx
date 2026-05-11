import type { Metadata } from "next";
import TopNavBar from "@/components/oranje/TopNavBar";
import HeroSection from "@/components/oranje/HeroSection";
import FeaturedCafesBentoGrid from "@/components/oranje/FeaturedCafesBentoGrid";
import WhyJoinSection from "@/components/oranje/WhyJoinSection";
import CTASection from "@/components/oranje/CTASection";
import OranjeFooter from "@/components/oranje/OranjeFooter";

export const metadata: Metadata = {
  title: "OranjeKijkers — Vind jouw WK-café",
  description: "De grootste gids voor cafés die WK 2026 uitzenden. Vind het perfecte Oranje-café bij jou in de buurt.",
};

export default function OranjePage() {
  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <TopNavBar />
      <main>
        <HeroSection />
        <FeaturedCafesBentoGrid />
        <WhyJoinSection />
        <CTASection />
      </main>
      <OranjeFooter />
    </div>
  );
}
