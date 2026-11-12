import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import {
  addTrackToPlaylist,
  removeTrack,
} from "@/features/library/server/use-cases";
import {
  playlistIdSchema,
  trackSnapshotSchema,
} from "@/features/library/server/schemas";
import { withLibraryErrors } from "@/features/library/server/api-response";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  return withLibraryErrors(async () => {
    const user = await requireUser();
    const { id } = playlistIdSchema.parse(await params);
    const track = trackSnapshotSchema.parse(await request.json());
    return NextResponse.json(
      { data: await addTrackToPlaylist(user.id, id, track) },
      { status: 201 },
    );
  });
}

export async function DELETE(request: Request, { params }: Context) {
  return withLibraryErrors(async () => {
    const user = await requireUser();
    const { id } = playlistIdSchema.parse(await params);
    const trackId = new URL(request.url).searchParams.get("trackId");
    if (!trackId)
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "trackId wajib diisi" } },
        { status: 400 },
      );
    await removeTrack(user.id, id, trackId);
    return new NextResponse(null, { status: 204 });
  });
}
