import Image from "next/image";
import { cn } from "@/lib/utils";

/** Fichier haute définition recommandé : au moins 512×512 px, ratio 1:1, dans `public/brand/`. */
export const BRAND_LOGO_PUBLIC_PATH = "/brand/logo-arabe-simplement.png";

type BrandLogoMarkProps = {
  /** Côté du cercle en pixels (affichage). L’image est demandée en ~2× pour limiter la pixelisation. */
  size?: number;
  className?: string;
  /** `true` pour le logo au-dessus de la ligne de flottaison (header, checkout). */
  priority?: boolean;
};

/**
 * Logo officiel dans un cercle parfait (ratio 1:1).
 * L’image remplit toute la bulle (`object-cover`), comme un fond circulaire.
 */
export function BrandLogoMark({
  size = 44,
  className,
  priority = false,
}: BrandLogoMarkProps) {
  const imgSizes = `${size}px`;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-brand-mint-50 ring-1 ring-black/10",
        "aspect-square",
        className
      )}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      <Image
        src={BRAND_LOGO_PUBLIC_PATH}
        alt="Arabe Simplement"
        fill
        sizes={imgSizes}
        quality={92}
        priority={priority}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
