export type VideoId = "app" | "texto" | "rose";
export type Format = "story" | "feed" | "square";

export const SIZES: Record<Format, [number, number]> = {
  story: [1080, 1920],
  feed: [1080, 1350],
  square: [1080, 1080],
};

export const DURATION: Record<VideoId, number> = { app: 12000, texto: 10500, rose: 12500 };
