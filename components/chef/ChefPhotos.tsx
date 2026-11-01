import Image from "next/image";
import { siteConfig } from "@/config/site.config";

/** Avatar redondo da Roseli (recorte do retrato principal). */
export function ChefAvatar({ size = 32, className = "" }: { size?: number; className?: string }) {
  const { photoMain, avatarFocus, name } = siteConfig.chef;
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={photoMain.src}
        alt={`Foto da ${name}`}
        fill
        sizes={`${size * 2}px`}
        className="object-cover"
        style={{ objectPosition: avatarFocus }}
      />
    </span>
  );
}

/** Foto em formato de arco (assinatura visual do tema). */
export function ArchPhoto({
  src,
  alt,
  sizes,
  priority,
  objectPosition = "50% 30%",
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-arch bg-ivory-deep ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
