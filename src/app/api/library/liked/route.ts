import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import {
  listSchema,
  trackSnapshotSchema,
} from "@/features/library/server/schemas";
import { listLiked, toggleLike } from "@/features/library/server/use-cases";
import { withLibraryErrors } from "@/features/library/server/api-response";

export async function GET(request: Request) {
  return withLibraryErrors(async () => {
    const user = await requireUser();
    const input = listSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const rows = await listLiked(user.id, input.limit, input.cursor);
    return NextResponse.json({
      data: rows.slice(0, input.limit),
      meta: {
        nextCursor:
          rows.length > input.limit ? rows[input.limit - 1]?.id : null,
      },
    });
  });
}

export async function POST(request: Request) {
  return withLibraryErrors(async () => {
    const user = await requireUser();
    const track = trackSnapshotSchema.parse(await request.json());
    const liked = await toggleLike(user.id, track);
    return NextResponse.json({ data: { liked } });
  });
}
