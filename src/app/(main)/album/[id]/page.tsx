import { BrowseDetail } from "@/components/shared/browse-detail";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { notFound } from "next/navigation";

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
