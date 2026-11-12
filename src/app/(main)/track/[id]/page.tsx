import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CoverImage } from "@/components/shared/cover-image";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { id as copy } from "@/lib/i18n/id";
import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const track = await getMusicProvider().getTrack((await params).id);
  if (!track) return {};
  return {
    title: `${track.title} — ${track.artists.join(", ")}`,
    description: `${track.title} oleh ${track.artists.join(", ")}. Sumber: ${track.source}.`,
    alternates: {
      canonical: new URL(`/track/${track.id}`, env.NEXT_PUBLIC_APP_URL),
    },
    openGraph: {
      type: "music.song",
      title: track.title,
      description: `${track.artists.join(", ")} · ${track.source}`,
      ...(track.coverUrl ? { images: [track.coverUrl] } : {}),
    },
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const track = await getMusicProvider().getTrack((await params).id);
  if (!track) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <CoverImage
          src={track.coverUrl}
          alt={track.title}
          size="lg"
          className="max-w-64"
        />
        <div>
          <h1 className="text-3xl font-semibold">{track.title}</h1>
          <p className="text-muted mt-2">{track.artists.join(", ")}</p>
          <p className="text-muted mt-4 text-sm">
            {copy.pages.trackSource}: {track.source}
          </p>
          <p className="text-muted mt-1 text-sm">
            {copy.pages.trackLicense}: {track.license}
          </p>
        </div>
      </div>
    </main>
  );
}
