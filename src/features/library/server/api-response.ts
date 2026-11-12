import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { UnauthorizedError } from "@/lib/auth";

import { LibraryNotFoundError } from "./use-cases";

export async function withLibraryErrors(
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Input tidak valid" } },
        { status: 400 },
      );
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 },
      );
    }
    if (error instanceof LibraryNotFoundError) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Resource tidak ditemukan" } },
        { status: 404 },
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: {
            code: error.code === "P2002" ? "CONFLICT" : "DATABASE_ERROR",
            message: "Operasi tidak dapat diproses",
          },
        },
        { status: error.code === "P2002" ? 409 : 500 },
      );
    }
    if (
      error instanceof Error &&
      (error.message === "DUPLICATE_TRACK" || error.message === "INVALID_ORDER")
    ) {
      return NextResponse.json(
        {
          error: {
            code:
              error.message === "DUPLICATE_TRACK"
                ? "CONFLICT"
                : "VALIDATION_ERROR",
            message: "Input tidak valid",
          },
        },
        { status: error.message === "DUPLICATE_TRACK" ? 409 : 400 },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan internal",
        },
      },
      { status: 500 },
    );
  }
}
