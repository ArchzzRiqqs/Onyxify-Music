"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type CoverImageProps = {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-10",
  md: "size-16",
  lg: "aspect-square w-full",
} as const;

export function CoverImage({
  src,
  alt,
  size = "md",
  className,
}: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "from-accent/70 via-elevated to-surface relative shrink-0 overflow-hidden rounded-xl bg-linear-to-br",
        sizeClasses[size],
        className,
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={size === "lg" ? "(max-width: 768px) 50vw, 240px" : "64px"}
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-accent/80 absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {alt.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}
