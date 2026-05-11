import rawLocations from "./locations.json";

export interface OranjeCafe {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  screens: number;
  hasLargeScreen: boolean;
  hasTerrace: boolean;
  hasSound: boolean;
  atmosphere: "druk" | "gezellig" | "rustig";
  isLive: boolean;
  rating: number;
  reviewCount: number;
  openHour: number;
  closeHour: number;
  gradient: string;
  matchDays: string[];
  imageUrl: string;
}

// Gradients — fallback when image fails to load
const GRADIENTS = [
  "from-orange-600 to-red-700",
  "from-amber-500 to-orange-600",
  "from-red-700 to-rose-800",
  "from-blue-700 to-blue-900",
  "from-teal-600 to-green-700",
  "from-purple-600 to-indigo-700",
  "from-yellow-500 to-amber-600",
  "from-slate-600 to-slate-800",
  "from-green-600 to-emerald-700",
  "from-orange-500 to-red-600",
  "from-cyan-600 to-blue-700",
  "from-rose-600 to-pink-700",
];

const ALL_DAYS = ["vr", "za", "zo", "ma", "di", "wo", "do"];

function deriveAtmosphere(screens: number): "druk" | "gezellig" | "rustig" {
  if (screens >= 6) return "druk";
  if (screens <= 2) return "rustig";
  return "gezellig";
}

function deriveMatchDays(id: number, screens: number): string[] {
  if (screens >= 8) return ALL_DAYS;
  if (screens >= 4) return ["vr", "za", "zo", "wo"];
  return ["za", "zo"];
}

function deriveRating(id: number, screens: number): number {
  const base = 3.8 + ((id * 13 + screens * 7) % 11) / 10;
  return Math.round(base * 10) / 10;
}

function deriveReviewCount(id: number, screens: number): number {
  return screens * 18 + id * 5 + 12;
}

// Real photo URLs scraped from café websites + curated Unsplash fallbacks
// Unsplash format: https://images.unsplash.com/photo-{ID}?w=600&h=400&fit=crop&auto=format
const CAFE_IMAGES: Record<string, string> = {
  // Amsterdam
  "1":  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format",  // Café De Oranje Leeuw
  "2":  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format",  // Proeflokaal De Jordaan
  "6":  "https://mosselengin.nl/wp-content/uploads/2025/08/2025.08MosselsGinWebsiteShoot@felipesperling_-76-1024x683.jpg",  // Mossel & Gin — ECHT
  "7":  "https://www.barbukowski.nl/upload/heading/home-600x600.jpg",                                       // Bar Bukowski — ECHT
  "8":  "https://cafethijssen.nl/buiten.jpg",                                                               // Café Thijssen — ECHT
  "9":  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format",  // Café de Walvis (terras)
  // Rotterdam
  "4":  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format",  // Blaak Sports Café
  "5":  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&auto=format",  // De Witte Leeuw
  "10": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop&auto=format",  // Panenka
  "11": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",     // Rotown
  "12": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&auto=format",  // Hollywood Sportsbar
  "30": "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=600&h=400&fit=crop&auto=format",  // Poolcafé Delfshaven
  // Den Haag
  "13": "https://www.ludendenhaag.nl/images/scale/621a9434-hdr-3.jpg",                                    // Café Luden — ECHT
  "14": "https://zwarteruiter.nl/wp-content/uploads/2026/03/YSD2102-PRcyls.jpg",                          // De Zwarte Ruiter — ECHT
  "15": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop&auto=format",     // Bar Club 188
  "29": "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=600&h=400&fit=crop&auto=format",  // The Fiddler
  // Groningen
  "16": "https://blockandbarrels.nl/wp-content/uploads/2017/09/L1042292.jpg",                              // Block & Barrels — ECHT
  "17": "https://www.thedogsbollocks.nl/wp-content/uploads/2023/08/Dogs_-Bollocks_Bar-1024x683.jpg",       // The Dog's Bollocks — ECHT
  "18": "https://images.unsplash.com/photo-1543007630-9068afa9c48e?w=600&h=400&fit=crop&auto=format",     // DOT
  "19": "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=600&h=400&fit=crop&auto=format",  // 't Gat van Groningen
  "20": "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=600&h=400&fit=crop&auto=format",     // Chaplin's Pub
  // Leeuwarden
  "21": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format",  // Grand Café De Brass
  "22": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format",  // De Dikke van Dale
  "23": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop&auto=format",     // De Markies (speciaalbier)
  // Zwolle
  "24": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format",  // The Referee
  // Nijmegen
  "25": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop&auto=format",  // De Drie Gezusters
  "26": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format",  // Café van Ouds
  // Utrecht
  "3":  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",     // Grand Café Neude
  "27": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&auto=format",  // Poolcafé Hart van Utrecht
  "28": "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=600&h=400&fit=crop&auto=format",  // Café Weerdzicht (kanaalzicht)
  // Middelburg
  "31": "https://i0.wp.com/www.cafebommel.nl/wp-content/uploads/2014/01/foto_bommelNu.png?w=940&ssl=1",   // Café Bommel — ECHT
  // Eindhoven
  "32": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&auto=format",  // Sportsbar Dugout
  "33": "https://images.squarespace-cdn.com/content/v1/5fbe4841cdc8f573dfacbaae/39d021ab-78c4-44eb-91ef-3071e9036769/Stadscafe_Spijker_1.jpg", // Stadscafé Spijker — ECHT
  // Maastricht
  "34": "https://images.unsplash.com/photo-1559329255-670258059737?w=600&h=400&fit=crop&auto=format",     // Café Forum
};

// Transform locations.json → OranjeCafe[]
export const oranjeCafes: OranjeCafe[] = rawLocations.map((loc, index) => {
  const id = Number(loc.id);
  return {
    id: loc.id,
    name: loc.name,
    address: loc.address,
    city: loc.city,
    lat: loc.lat,
    lng: loc.lng,
    screens: loc.screens,
    hasLargeScreen: loc.hasLargeScreen,
    hasTerrace: loc.hasTerrace,
    hasSound: loc.hasLargeScreen || loc.screens >= 3,
    atmosphere: deriveAtmosphere(loc.screens),
    isLive: loc.screens >= 4,
    rating: deriveRating(id, loc.screens),
    reviewCount: deriveReviewCount(id, loc.screens),
    openHour: loc.openHour,
    closeHour: loc.closeHour,
    gradient: GRADIENTS[index % GRADIENTS.length],
    matchDays: deriveMatchDays(id, loc.screens),
    imageUrl: CAFE_IMAGES[loc.id] ?? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&auto=format",
  };
});

export function getCafeById(id: string): OranjeCafe | undefined {
  return oranjeCafes.find((c) => c.id === id);
}
