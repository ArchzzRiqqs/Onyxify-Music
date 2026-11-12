import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createLibraryRepository } from "@/features/library/server/repository";
import {
  createPlaylistSchema,
  listSchema,
} from "@/features/library/server/schemas";
import { createPlaylist } from "@/features/library/server/use-cases";

export async function GET(request: Request) {
  const user = await requireUser();
  const input = listSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const rows = await createLibraryRepository(prisma).listPlaylists(
    user.id,
    input.limit,
    input.cursor,
  );
  const hasMore = rows.length > input.limit;
  return NextResponse.json({
    data: rows.slice(0, input.limit),
    meta: { nextCursor: hasMore ? rows[input.limit - 1]?.id : null },
  });
}

export async function POST(request: Request) {
  const user = await requireUser();
  const input = createPlaylistSchema.parse(await request.json());
  const data = await createPlaylist(user.id, input);
  return NextResponse.json({ data }, { status: 201 });
}
