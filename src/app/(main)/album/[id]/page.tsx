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
  const album = await getMusicProvider().getAlbum((await params).id);
  if (!album) return {};
  return {
    title: `${album.title} — ${album.artist}`,
    description: `Album ${album.title} oleh ${album.artist}.`,
    alternates: {
      canonical: new URL(`/album/${album.id}`, env.NEXT_PUBLIC_APP_URL),
    },
    ...(album.coverUrl ? { openGraph: { images: [album.coverUrl] } } : {}),
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const album = await getMusicProvider().getAlbum((await params).id);
  if (!album) {
    notFound();
  }
  return (
    <BrowseDetail
      title={album.title}
      subtitle={album.artist}
      coverUrl={album.coverUrl}
      tracks={album.tracks}
    />
  );
}
