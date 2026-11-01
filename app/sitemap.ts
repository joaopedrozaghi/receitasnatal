import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politica-de-reembolso`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
