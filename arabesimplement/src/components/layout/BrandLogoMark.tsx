import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoMarkProps = {
  size?: number;
  className?: string;
};

/** Logo officiel (cercle) — fichier dans `/public/brand/logo-arabe-simplement.png`. */
export function BrandLogoMark({ size = 40, className }: BrandLogoMarkProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-1 ring-black/10",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-arabe-simplement.png"
        alt="Arabe Simplement"
        width={size}
        height={size}
        className="object-cover"
        priority
      />
    </div>
  );
}
