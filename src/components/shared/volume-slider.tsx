"use client";

import { Slider } from "@/components/ui/slider";

type VolumeSliderProps = {
  volume: number;
  onChange: (volume: number) => void;
};

export function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  return (
    <Slider
      aria-label="Volume"
      value={[volume * 100]}
      max={100}
      step={1}
      onValueChange={(value) => {
        const nextVolume = value[0];
        if (typeof nextVolume === "number") {
          onChange(nextVolume / 100);
        }
      }}
      className="w-24"
    />
  );
}
