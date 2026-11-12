import { NextResponse } from "next/server";

import { errorResponse } from "@/features/catalog/server/api-response";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";

export async function GET() {
  try {
    const data = await getMusicProvider().getFeatured();
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}
