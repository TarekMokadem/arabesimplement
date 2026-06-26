import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

const HERO_BG = "/images/hero/lire-arabe-10-lecons-bg-16x9-v2.png";

/** Vert « herbe » du visuel (titres, flèche, icônes) — distinct du sage clair de la marque. */
const HERO_GREEN = "#4f8043";

type HeroLireArabeSectionProps = {
  /** CTA principal « Découvrir la méthode ». */
  decouvrirHref: string;
  /** CTA secondaire « Voir le programme ». */
  programmeHref: string;
};

type TrustItem = {
  icon: typeof BookOpen;
  lines: [string, string];
};

const TRUST_ITEMS: TrustItem[] = [
  { icon: BookOpen, lines: ["Méthode inspirée de", "l’enseignement en Égypte"] },
  { icon: Box, lines: ["Supports du niveau", "1 au 11"] },
  { icon: Users, lines: ["Accompagnement", "personnalisé"] },
  { icon: Clock, lines: ["Progressez à", "votre rythme"] },
];

const ACCESS_LINE = "Accessible aux débutants complets • 100% en ligne";

/** Flèche incurvée (image fournie, fond transparent) — gauche → droite. */
const HERO_ARROW = "/images/hero/fleche-10-lecons.png";

export function HeroLireArabeSection({
  decouvrirHref,
  programmeHref,
}: HeroLireArabeSectionProps) {
  return (
    <section className="bg-[#f4f2ea] py-6 sm:py-10 md:py-0">
      {/* ===== Desktop : fond plein largeur, recadré en haut pour remonter les carnets ===== */}
      <div className="relative hidden w-full overflow-hidden aspect-[16/8] [container-type:inline-size] md:block">
        <Image
          src={HERO_BG}
          alt="Bureau avec deux carnets : alphabet arabe et premiers textes"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_100%]"
        />

        {/* Bloc haut : badge + titre + sous-titre */}
        <div className="absolute left-1/2 top-[2.5cqw] w-[64cqw] -translate-x-1/2 text-center">
          <span className="inline-flex items-center gap-[0.6cqw] rounded-full bg-[#e7efe0]/90 px-[1.4cqw] py-[0.5cqw] text-[clamp(0.6rem,0.95cqw,0.8rem)] font-semibold uppercase tracking-[0.12em] text-[#3f6b3a]">
            <CheckCircle2 className="size-[1.2cqw]" style={{ color: HERO_GREEN }} />
            Méthode progressive &amp; approuvée
          </span>

          <h1 className="mt-[1.2cqw] font-serif font-bold leading-[1.04] text-[clamp(1.5rem,3.1cqw,2.5rem)] text-[#20291b]">
            Apprenez à lire l’arabe
            <br />
            <span style={{ color: HERO_GREEN }}>en 10 leçons</span>
          </h1>

          <p className="mx-auto mt-[1cqw] max-w-[30cqw] text-[clamp(0.72rem,1.15cqw,0.95rem)] leading-snug text-[#5b6353]">
            Passez progressivement de la découverte de l’alphabet à la lecture de
            vos premiers mots et textes arabes.
          </p>
        </div>

        {/* Colonne gauche : AUJOURD'HUI (au-dessus du carnet de gauche) */}
        <div className="absolute left-[24cqw] top-[12.5cqw] w-[26cqw] -translate-x-1/2 text-center">
          <span className="inline-flex rounded-md bg-[#6f6f64] px-[1cqw] py-[0.35cqw] text-[clamp(0.55rem,0.85cqw,0.72rem)] font-semibold uppercase tracking-[0.1em] text-white">
            Aujourd’hui
          </span>
          <p className="mt-[0.8cqw] text-[clamp(0.78rem,1.35cqw,1.05rem)] font-semibold leading-snug text-[#2b3326]">
            Vous ne connaissez
            <br />
            <span style={{ color: HERO_GREEN }}>pas encore</span> l’alphabet
          </p>
        </div>

        {/* Colonne droite : APRÈS 10 LEÇONS (au-dessus du carnet de droite) */}
        <div className="absolute left-[71cqw] top-[12.5cqw] w-[28cqw] -translate-x-1/2 text-center">
          <span className="inline-flex rounded-md bg-[#7d9a70] px-[1cqw] py-[0.35cqw] text-[clamp(0.55rem,0.85cqw,0.72rem)] font-semibold uppercase tracking-[0.1em] text-white">
            Après 10 leçons
          </span>
          <p className="mt-[0.8cqw] text-[clamp(0.78rem,1.35cqw,1.05rem)] font-semibold leading-snug text-[#2b3326]">
            Vous commencez à lire
            <br />
            <span style={{ color: HERO_GREEN }}>vos premiers mots et textes</span>
          </p>
        </div>

        {/* Colonne centrale : flèche + 10 leçons (espace vide entre les carnets) */}
        <div className="absolute left-1/2 top-[16.5cqw] w-[22cqw] -translate-x-1/2 text-center">
          <span className="mx-auto flex size-[3.8cqw] items-center justify-center rounded-full bg-[#e7efe0]">
            <BookOpen className="size-[1.9cqw]" style={{ color: HERO_GREEN }} />
          </span>
          <Image
            src={HERO_ARROW}
            alt=""
            width={846}
            height={295}
            aria-hidden
            className="mx-auto mt-[0.4cqw] h-auto w-[13cqw]"
          />
          <p
            className="mt-[0.4cqw] text-[clamp(1rem,2cqw,1.4rem)] font-bold"
            style={{ color: HERO_GREEN }}
          >
            10 leçons
          </p>
          <p className="text-[clamp(0.85rem,1.65cqw,1.2rem)] font-bold text-[#243019]">
            progressives
          </p>
          <p className="mx-auto  mt-[0.4cqw] max-w-[13cqw] text-[clamp(0.62rem,1cqw,0.82rem)] leading-snug text-[#6a7160]">
            Une méthode claire, étape par étape, pour des bases solides et
            durables.
          </p>
        </div>

        {/* Boutons */}
        <div className="absolute left-1/2 top-[34.8cqw] flex -translate-x-1/2 items-center gap-[1.2cqw]">
          <Link
            href={decouvrirHref}
            className="inline-flex items-center gap-[0.6cqw] rounded-[0.7cqw] px-[2.2cqw] py-[1cqw] text-[clamp(0.72rem,1.2cqw,0.95rem)] font-semibold text-white shadow-md transition-colors"
            style={{ backgroundColor: HERO_GREEN }}
          >
            Découvrir la méthode
            <ArrowRight className="size-[1.4cqw]" />
          </Link>
          <Link
            href={programmeHref}
            className="inline-flex items-center rounded-[0.7cqw] border border-[#cdd8c2] bg-white px-[2.2cqw] py-[1cqw] text-[clamp(0.72rem,1.2cqw,0.95rem)] font-semibold text-[#2b3326] shadow-sm transition-colors hover:bg-[#f3f7ee]"
          >
            Voir le programme
          </Link>
        </div>

        {/* Panneau bas */}
        <div className="absolute inset-x-[2.5cqw] bottom-[1.5cqw] rounded-[1.2cqw] border border-[#e4e2d7] bg-white/80 px-[2.2cqw] py-[1.2cqw] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-[1.3cqw]">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.lines[0]}
                className="flex flex-1 items-center justify-center gap-[0.7cqw]"
              >
                <span className="flex size-[2.6cqw] shrink-0 items-center justify-center rounded-full bg-[#e7efe0]">
                  <item.icon className="size-[1.3cqw]" style={{ color: HERO_GREEN }} />
                </span>
                <p className="text-[clamp(0.6rem,1cqw,0.82rem)] leading-snug text-[#3a4233]">
                  {item.lines[0]}
                  <br />
                  {item.lines[1]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-[0.8cqw] border-t border-[#e4e2d7] pt-[0.7cqw] text-center text-[clamp(0.6rem,1cqw,0.82rem)] text-[#5b6353]">
            {ACCESS_LINE}
          </div>
        </div>
      </div>

      {/* ===== Mobile : version épurée, parcours en timeline verticale ===== */}
      <div className="px-5 md:hidden">
        <div className="mx-auto max-w-md">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7efe0] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3f6b3a]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: HERO_GREEN }} />
              Méthode progressive &amp; approuvée
            </span>
          </div>

          <h1 className="mt-4 text-center font-serif text-[2rem] font-bold leading-[1.12] text-[#20291b]">
            Apprenez à lire l’arabe{" "}
            <span style={{ color: HERO_GREEN }}>en 10 leçons</span>
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-[#5b6353]">
            Passez progressivement de la découverte de l’alphabet à la lecture de
            vos premiers mots et textes.
          </p>

          {/* Timeline : Aujourd'hui → 10 leçons → Après */}
          <ol className="relative mt-8 space-y-6 border-l-2 border-dashed border-[#cdd8c2] pl-7">
            <li className="relative">
              <span
                className="absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full bg-[#6f6f64] ring-4 ring-[#f4f2ea]"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="inline-flex rounded-md bg-[#6f6f64]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5f5f55]">
                Aujourd’hui
              </span>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-[#2b3326]">
                Vous ne connaissez{" "}
                <span style={{ color: HERO_GREEN }}>pas encore</span> l’alphabet
              </p>
            </li>

            <li className="relative">
              <span
                className="absolute -left-[39px] flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-[#f4f2ea]"
                style={{ backgroundColor: HERO_GREEN }}
                aria-hidden
              >
                <BookOpen className="h-4 w-4 text-white" />
              </span>
              <p className="text-lg font-bold leading-tight" style={{ color: HERO_GREEN }}>
                10 leçons progressives
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-[#6a7160]">
                Une méthode claire, étape par étape, pour des bases solides et
                durables.
              </p>
            </li>

            <li className="relative">
              <span
                className="absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full bg-[#7d9a70] ring-4 ring-[#f4f2ea]"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="inline-flex rounded-md bg-[#7d9a70]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5d7a50]">
                Après 10 leçons
              </span>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-[#2b3326]">
                Vous commencez à lire{" "}
                <span style={{ color: HERO_GREEN }}>
                  vos premiers mots et textes
                </span>
              </p>
            </li>
          </ol>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={decouvrirHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-md"
              style={{ backgroundColor: HERO_GREEN }}
            >
              Découvrir la méthode
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={programmeHref}
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#cdd8c2] bg-white px-6 py-3.5 text-base font-semibold text-[#2b3326] shadow-sm"
            >
              Voir le programme
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-[#e4e2d7] bg-white/70 p-4">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item.lines[0]} className="flex items-center gap-2.5 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7efe0]">
                    <item.icon className="h-4 w-4" style={{ color: HERO_GREEN }} />
                  </span>
                  <p className="text-[12px] font-medium leading-snug text-[#3a4233]">
                    {item.lines[0]} {item.lines[1]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-[#e4e2d7] pt-3 text-center text-[12px] text-[#5b6353]">
              {ACCESS_LINE}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
