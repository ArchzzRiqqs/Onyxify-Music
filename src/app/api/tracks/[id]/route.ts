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
    const data = await getMusicProvider().getTrack(id);
    return data
      ? NextResponse.json({ data })
      : NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Track tidak ditemukan" } },
          { status: 404 },
        );
  } catch (error) {
    return errorResponse(error);
  }
}
