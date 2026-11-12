"use client";

import { Slider } from "@/components/ui/slider";

type SeekBarProps = {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
};

export function SeekBar({ position, duration, onSeek }: SeekBarProps) {
  return (
    <Slider
      aria-label="Posisi lagu"
      value={[duration > 0 ? Math.min(position, duration) : 0]}
      max={duration || 1}
      step={1}
      onValueChange={(value) => {
        const nextPosition = value[0];
        if (typeof nextPosition === "number") {
          onSeek(nextPosition);
        }
      }}
    />
  );
}
