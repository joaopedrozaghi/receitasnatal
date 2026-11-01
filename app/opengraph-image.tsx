import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";

export const alt = siteConfig.brand.fullName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const photo = await readFile(path.join(process.cwd(), "public", siteConfig.chef.photoHero.src));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0A2B20" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px",
            width: "680px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: "#F2D79B",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {`${siteConfig.brand.name} · ${siteConfig.brand.edition}`}
          </div>
          <div style={{ fontSize: 60, lineHeight: 1.08, color: "#FFF3E0", fontWeight: 700, marginTop: 24 }}>
            {copy.hero.headlines[siteConfig.hero.headline].replace(/\*/g, "")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              background: "#C8102E",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 800,
              borderRadius: 999,
              padding: "16px 32px",
              alignSelf: "flex-start",
            }}
          >
            {copy.hero.pill}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={520}
          height={630}
          style={{ objectFit: "cover", width: 520, height: 630 }}
        />
      </div>
    ),
    size,
  );
}
