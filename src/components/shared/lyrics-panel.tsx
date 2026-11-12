"use client";

import { useEffect, useMemo, useRef } from "react";

import { parseLrc } from "@/features/lyrics/parse-lrc";

export function LyricsPanel({
  source,
  positionSec,
}: {
  source?: string;
  positionSec: number;
}) {
  const lines = useMemo(() => (source ? parseLrc(source) : []), [source]);
  const activeIndex = lines.reduce(
    (current, line, index) =>
      line.timeMs <= positionSec * 1000 ? index : current,
    -1,
  );
  const activeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex]);

  if (lines.length === 0) {
    return (
      <p className="text-muted py-8 text-center text-sm">
        Lirik belum tersedia.
      </p>
    );
  }

  return (
    <div
      className="max-h-64 space-y-3 overflow-y-auto py-4 text-center"
      aria-label="Lirik lagu"
    >
      {lines.map((line, index) => (
        <p
          key={`${line.timeMs}-${index}`}
          ref={index === activeIndex ? activeRef : undefined}
          className={
            index === activeIndex ? "text-accent font-semibold" : "text-muted"
          }
        >
          {line.text || "♪"}
        </p>
      ))}
    </div>
  );
}
