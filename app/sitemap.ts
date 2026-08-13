import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { tools } from "@/data/tools";
import { solutionPages } from "@/data/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/platform", priority: 0.9 },
    { path: "/tools", priority: 0.8 },
    { path: "/solutions", priority: 0.8 },
    { path: "/company", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      // Front doors carry the public search intent; inside tools rank lower.
      priority: tool.kind === "front-door" ? 0.8 : 0.7,
    })),
    ...solutionPages.map((page) => ({
      url: `${SITE_URL}/solutions/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
