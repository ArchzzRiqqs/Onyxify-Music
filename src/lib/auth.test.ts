import { describe, expect, it, vi } from "vitest";

const getServerSession = vi.fn();

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ prisma: {} }));
vi.mock("@/lib/env", () => ({ env: { AUTH_SECRET: "test-secret" } }));

describe("requireUser", () => {
  it("returns the authenticated user", async () => {
    getServerSession.mockResolvedValue({
      user: { id: "user-1", email: "listener@example.com" },
    });
    const { requireUser } = await import("./auth");

    await expect(requireUser()).resolves.toMatchObject({ id: "user-1" });
  });

  it("throws when the session is missing", async () => {
    getServerSession.mockResolvedValue(null);
    const { requireUser, UnauthorizedError } = await import("./auth");

    await expect(requireUser()).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
