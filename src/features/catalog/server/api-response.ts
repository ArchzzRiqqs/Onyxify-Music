import { NextResponse } from "next/server";
import { z } from "zod";

import { ProviderError } from "./provider-error";

export const searchParamsSchema = z.object({
  q: z.string().trim().min(1).max(100),
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const idParamsSchema = z.object({
  id: z.string().trim().min(1).max(200),
});

export function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Input tidak valid" } },
      { status: 400 },
    );
  }
  if (error instanceof ProviderError) {
    return NextResponse.json(
      {
        error: {
          code: `PROVIDER_${error.code.toUpperCase()}`,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }
  return NextResponse.json(
    {
      error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan internal" },
    },
    { status: 500 },
  );
}
