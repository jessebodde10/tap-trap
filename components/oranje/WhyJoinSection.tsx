import { MapPin, CalendarDays, Star, Store, Beer, Trophy } from "lucide-react";

const features = [
  {
    icon: <MapPin size={22} className="text-white" />,
    title: "Vind cafés bij jou",
    desc: "Gebruik de interactieve kaart of zoek op stad. Filter op groot scherm, terras, live-sfeer en meer.",
  },
  {
    icon: <CalendarDays size={22} className="text-white" />,
    title: "Wedstrijdagenda",
    desc: "Zie precies welke wedstrijden elk café uitzendt. Mis geen enkel duel van Oranje.",
  },
  {
    icon: <Star size={22} className="text-white" />,
    title: "Reviews & sfeer",
    desc: "Lees ervaringen van andere fans. Kies bewust voor het café dat bij jou past.",
  },
  {
    icon: <Store size={22} className="text-white" />,
    title: "Gratis aanmelden",
    desc: "Café-eigenaar? Meld je gratis aan en bereik duizenden voetbalfans tijdens het WK.",
  },
  {
    icon: <Beer size={22} className="text-white" />,
    title: "Alles op één plek",
    desc: "Van openingstijden tot tapbier en reserveren — alle info netjes bij elkaar.",
  },
  {
    icon: <Trophy size={22} className="text-white" />,
    title: "WK-sfeer gegarandeerd",
    desc: "Al meer dan 200 cafés aangemeld verspreid over heel Nederland.",
  },
];

export default function WhyJoinSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a93100] mb-3" style={{ fontFamily: "var(--font-lexend)" }}>
            Waarom OranjeKijkers?
          </p>
          <h2
            className="text-3xl md:text-4xl font-black text-[#3f2c26] max-w-xl mx-auto leading-tight"
            style={{ fontFamily: "var(--font-anybody)" }}
          >
            Alles voor de ultieme WK-ervaring
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#fff8f6] rounded-2xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a93100] to-[#d34000] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <p
                className="text-base font-black text-[#3f2c26] mb-2"
                style={{ fontFamily: "var(--font-anybody)" }}
              >
                {title}
              </p>
              <p className="text-sm text-[#7a5c55] leading-relaxed" style={{ fontFamily: "var(--font-lexend)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
