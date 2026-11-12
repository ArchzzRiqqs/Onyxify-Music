import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/search", "/track/", "/album/", "/artist/"],
      disallow: [
        "/api/",
        "/library",
        "/playlist/",
        "/login",
        "/dev/",
        "/design",
      ],
    },
    sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_APP_URL).toString(),
  };
}
