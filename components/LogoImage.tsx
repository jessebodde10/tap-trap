"use client";

import { useEffect, useRef } from "react";

export default function LogoImage({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      const SIZE = 88; // 2× for retina
      canvas.width = SIZE;
      canvas.height = SIZE;
      canvas.style.width = "44px";
      canvas.style.height = "44px";
      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
      const { data } = imageData;

      // Replace near-white pixels with transparent
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = "/Logo.png";
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
