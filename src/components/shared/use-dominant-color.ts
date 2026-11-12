"use client";

import { useEffect, useState } from "react";

export function useDominantColor(src?: string) {
  const [color, setColor] = useState("var(--accent)");

  useEffect(() => {
    if (!src) {
      return;
    }
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, 32, 32);
      const pixels = context.getImageData(0, 0, 32, 32).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let count = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if ((pixels[index + 3] ?? 0) < 128) continue;
        red += pixels[index] ?? 0;
        green += pixels[index + 1] ?? 0;
        blue += pixels[index + 2] ?? 0;
        count += 1;
      }
      if (count > 0)
        setColor(
          `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})`,
        );
    };
    image.onerror = () => setColor("var(--accent)");
    image.src = src;
  }, [src]);

  return color;
}
