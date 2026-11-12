import { BrowseDetail } from "@/components/shared/browse-detail";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const artist = await getMusicProvider().getArtist((await params).id);
  if (!artist) return {};
  return {
    title: artist.name,
    description: `Dengarkan lagu dari ${artist.name} di Onyxify.`,
    alternates: {
      canonical: new URL(`/artist/${artist.id}`, env.NEXT_PUBLIC_APP_URL),
    },
    ...(artist.imageUrl ? { openGraph: { images: [artist.imageUrl] } } : {}),
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const artist = await getMusicProvider().getArtist((await params).id);
  if (!artist) {
    notFound();
  }
  return (
    <BrowseDetail
      title={artist.name}
      subtitle={artist.license}
      coverUrl={artist.imageUrl}
      tracks={artist.topTracks}
    />
  );
}
