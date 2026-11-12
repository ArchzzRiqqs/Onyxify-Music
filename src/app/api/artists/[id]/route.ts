import { NextResponse } from "next/server";

import {
  errorResponse,
  idParamsSchema,
} from "@/features/catalog/server/api-response";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = idParamsSchema.parse(await params);
    const data = await getMusicProvider().getArtist(id);
    return data
      ? NextResponse.json({ data })
      : NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Artis tidak ditemukan" } },
          { status: 404 },
        );
  } catch (error) {
    return errorResponse(error);
  }
}
