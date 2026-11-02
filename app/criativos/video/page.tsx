import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DURATION, SIZES, type Format, type VideoId } from "./config";
import { Stage } from "./Stage";

export const metadata: Metadata = { title: "Vídeos", robots: { index: false, follow: false } };

/** Vídeos animados (só em desenvolvimento). Ex.: /criativos/video?v=texto&f=feed&play=1 */
export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; f?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const v = (q.v && q.v in DURATION ? q.v : "app") as VideoId;
  const f = (q.f && q.f in SIZES ? q.f : "feed") as Format;
  return (
    <>
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <Stage v={v} f={f} />
    </>
  );
}
