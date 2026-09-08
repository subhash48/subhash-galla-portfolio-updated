import type { MetadataRoute } from "next";
import { portfolio } from "@/content/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = portfolio.meta.siteUrl;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...portfolio.work
      .filter((p) => p.links.caseStudy)
      .map((p) => ({
        url: `${base}/work/${p.slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
  ];
}
