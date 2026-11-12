"use client";

import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlayButtonProps = {
  isPlaying?: boolean;
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
} as const;

export function PlayButton({
  isPlaying = false,
  onClick,
  label,
  size = "md",
  className,
}: PlayButtonProps) {
  const action = isPlaying ? "Jeda" : "Putar";

  return (
    <Button
      type="button"
      size="icon"
      className={cn(
        "bg-accent text-accent-foreground hover:bg-accent/85 rounded-full",
        sizes[size],
        className,
      )}
      aria-label={label ?? action}
      aria-pressed={isPlaying}
      onClick={onClick}
    >
      {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
    </Button>
  );
}
