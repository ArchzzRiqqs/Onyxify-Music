import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { reorderTracks } from "@/features/library/server/use-cases";
import {
  playlistIdSchema,
  reorderSchema,
} from "@/features/library/server/schemas";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const user = await requireUser();
  const { id } = playlistIdSchema.parse(await params);
  const { trackIds } = reorderSchema.parse(await request.json());
  await reorderTracks(user.id, id, trackIds);
  return NextResponse.json({ data: { ok: true } });
}
