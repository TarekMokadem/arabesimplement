import Image from "next/image";
import { isNextImageRemoteSrcAllowed } from "@/lib/shop/formation-cover-image";

type Props = {
  src: string;
  alt: string;
  /** Conteneur déjà en `relative` + taille (ex. aspect-square + max-w). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Image de couverture fiche formation : `next/image` si domaine autorisé, sinon `<img>`
 * (évite l’erreur serveur « hostname not configured »).
 */
export function FormationCoverImage({
  src,
  alt,
  fill = true,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  className = "object-cover object-center",
}: Props) {
  if (!isNextImageRemoteSrcAllowed(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- repli volontaire hors remotePatterns
      <img
        src={src}
        alt={alt}
        className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
