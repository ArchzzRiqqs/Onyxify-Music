import { NextResponse } from "next/server";

import {
  errorResponse,
  searchParamsSchema,
} from "@/features/catalog/server/api-response";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { checkRateLimit, getTrustedClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const input = searchParamsSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const rate = await checkRateLimit(`search:${getTrustedClientIp(request)}`);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: { code: "RATE_LIMITED", message: "Terlalu banyak permintaan" },
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
      );
    }
    const data = await getMusicProvider().searchTracks(input.q, input);
    return NextResponse.json({ data, meta: { query: input.q } });
  } catch (error) {
    return errorResponse(error);
  }
}
