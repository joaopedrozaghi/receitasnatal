import { siteConfig } from "@/config/site.config";

export const siteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl).replace(/\/$/, "");
