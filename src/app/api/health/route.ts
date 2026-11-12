import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await prisma.$connect();
    return NextResponse.json({ data: { status: "ok" } });
  } catch (error) {
    logger.error("Health check failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: { code: "UNHEALTHY", message: "Service unavailable" } },
      { status: 503 },
    );
  }
}
