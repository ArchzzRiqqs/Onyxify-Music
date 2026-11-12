import { describe, expect, it } from "vitest";

import { envSchema } from "./env-schema";

describe("environment schema", () => {
  it("accepts a complete environment", () => {
    const result = envSchema.safeParse({
      DATABASE_URL: "postgresql://user:password@localhost:5432/onyxify",
      AUTH_SECRET: "a-secure-secret",
      JAMENDO_CLIENT_ID: "jamendo-client-id",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing required values", () => {
    const result = envSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
