import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createLibraryRepository } from "@/features/library/server/repository";
import {
  playlistIdSchema,
  renamePlaylistSchema,
} from "@/features/library/server/schemas";
import {
  deletePlaylist,
  renamePlaylist,
} from "@/features/library/server/use-cases";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id } = playlistIdSchema.parse(await params);
  const session = await getServerSession(authOptions);
  const data = await createLibraryRepository(prisma).findPlaylist(
    id,
    session?.user?.id,
  );
  if (!data)
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Playlist tidak ditemukan" } },
      { status: 404 },
    );
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Context) {
  const user = await requireUser();
  const { id } = playlistIdSchema.parse(await params);
  const { name } = renamePlaylistSchema.parse(await request.json());
  return NextResponse.json({ data: await renamePlaylist(user.id, id, name) });
}

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireUser();
  const { id } = playlistIdSchema.parse(await params);
  await deletePlaylist(user.id, id);
  return new NextResponse(null, { status: 204 });
}
