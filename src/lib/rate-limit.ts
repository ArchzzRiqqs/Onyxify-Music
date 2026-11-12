import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const windowMs = 60_000;
const maxRequests = 60;
const maxBuckets = 10_000;
const buckets = new Map<string, Bucket>();

let distributedLimiter: Ratelimit | undefined;

function getDistributedLimiter() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return undefined;
  }
  distributedLimiter ??= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(maxRequests, "60 s"),
    prefix: "onyxify:rate-limit",
  });
  return distributedLimiter;
}

function checkDevelopmentLimit(key: string): RateLimitResult {
  const now = Date.now();
  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }
  while (buckets.size > maxBuckets) {
    const oldest = buckets.keys().next().value;
    if (typeof oldest !== "string") break;
    buckets.delete(oldest);
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const limiter = getDistributedLimiter();
  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Upstash rate limit is not configured");
    }
    return checkDevelopmentLimit(key);
  }

  const result = await limiter.limit(key);
  return {
    allowed: result.success,
    retryAfter: result.success
      ? 0
      : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}

export function getTrustedClientIp(request: Request) {
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
