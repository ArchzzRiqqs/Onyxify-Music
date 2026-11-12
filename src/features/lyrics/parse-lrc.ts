export type LyricLine = {
  timeMs: number;
  text: string;
};

const timestampPattern = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
const offsetPattern = /^\[offset:([+-]?\d+)\]\s*$/i;

export function parseLrc(source: string): LyricLine[] {
  let offsetMs = 0;
  const lines: LyricLine[] = [];

  for (const rawLine of source.split(/\r?\n/)) {
    const offset = rawLine.match(offsetPattern);
    if (offset) {
      offsetMs = Number(offset[1]);
      continue;
    }

    const matches = [...rawLine.matchAll(timestampPattern)];
    if (matches.length === 0) continue;
    const text = rawLine.replace(timestampPattern, "").trim();
    for (const match of matches) {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fraction = match[3] ?? "0";
      if (!Number.isFinite(minutes) || seconds > 59) continue;
      const fractionMs =
        fraction.length === 1
          ? Number(fraction) * 100
          : fraction.length === 2
            ? Number(fraction) * 10
            : Number(fraction.slice(0, 3));
      lines.push({
        timeMs: Math.max(
          0,
          minutes * 60_000 + seconds * 1_000 + fractionMs + offsetMs,
        ),
        text,
      });
    }
  }

  return lines.sort((a, b) => a.timeMs - b.timeMs);
}
