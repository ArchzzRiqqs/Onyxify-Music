import { describe, expect, it, vi } from "vitest";

import { checkRateLimit, getTrustedClientIp } from "./rate-limit";

describe("rate limiter", () => {
  it("uses only the trusted real-ip header", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.10" },
    });

    expect(getTrustedClientIp(request)).toBe("unknown");
  });

  it("limits a key in the development fallback", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const key = `test:${crypto.randomUUID()}`;

    for (let attempt = 0; attempt < 60; attempt += 1) {
      await expect(checkRateLimit(key)).resolves.toMatchObject({
        allowed: true,
      });
    }

    await expect(checkRateLimit(key)).resolves.toMatchObject({
      allowed: false,
    });
  });
});
