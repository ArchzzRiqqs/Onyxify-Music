import { BrowseDetail } from "@/components/shared/browse-detail";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { notFound } from "next/navigation";

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
