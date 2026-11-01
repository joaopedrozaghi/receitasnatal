import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.fullName,
    short_name: siteConfig.brand.name,
    description: siteConfig.brand.tagline,
    start_url: "/",
    display: "browser",
    background_color: "#FFF8EE",
    theme_color: "#0A2B20",
    lang: "pt-BR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
