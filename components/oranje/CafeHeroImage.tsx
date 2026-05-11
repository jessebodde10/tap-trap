"use client";

interface Props {
  src: string;
  alt: string;
}

export default function CafeHeroImage({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}
