import type { MetadataRoute } from "next";
import { portfolio } from "@/content/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${portfolio.meta.siteUrl}/sitemap.xml`,
  };
}
