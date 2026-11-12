import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/search"];
  return routes.map((route) => ({
    url: new URL(route, env.NEXT_PUBLIC_APP_URL).toString(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
