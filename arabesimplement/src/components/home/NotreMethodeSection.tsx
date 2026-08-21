import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const methodSteps = [
  {
    number: "01",
    title: "Les lettres isolées",
    description:
      "Découvrez chaque lettre de l'alphabet, apprenez à la reconnaître et à la prononcer correctement.",
  },
  {
    number: "02",
    title: "Les voyelles courtes",
    description:
      "Maîtrisez les trois voyelles fondamentales : fatha, kasra et damma.",
  },
  {
    number: "03",
    title: "Les lettres attachées",
    description:
      "Comprenez comment les lettres se lient entre elles selon leur position dans le mot.",
  },
  {
    number: "04",
    title: "Les voyelles longues",
    description:
      "Apprenez les prolongations essentielles pour lire avec fluidité.",
  },
  {
    number: "05",
    title: "La lecture fluide",
    description:
      "Lisez vos premiers mots, puis vos premiers textes en arabe avec aisance.",
  },
] as const;

function MethodStepsList({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";

  return (
    <ol
      className={
        isMobile
          ? "relative space-y-0 border-l-2 border-dashed border-primary/25 pl-6"
          : "space-y-5"
      }
    >
      {methodSteps.map((step) => (
        <li
          key={step.number}
          className={
            isMobile
              ? "relative pb-6 last:pb-0"
              : "flex items-start gap-4"
          }
        >
          {isMobile ? (
            <>
              <span className="absolute -left-[calc(1.5rem+1px)] top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">
                {step.number}
              </span>
              <div className="rounded-xl border border-[#d8e2cf] bg-[#f4f5f0]/80 px-4 py-3">
                <h3 className="mb-1 text-sm font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-white">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

export function NotreMethodeSection() {
  return (
    <section
      id="notre-methode"
      className="scroll-mt-24 bg-white py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Colonne texte */}
          <div>
            <Badge className="mb-3 border-transparent bg-primary/10 text-primary hover:bg-primary/10 md:mb-4">
              Notre méthode
            </Badge>
            <h2 className="mb-4 font-serif text-2xl font-bold leading-tight text-primary sm:text-3xl md:mb-5 md:text-4xl lg:text-[2.75rem]">
              <span className="md:hidden">
                Apprendre à lire l&apos;arabe, étape par étape
              </span>
              <span className="hidden md:inline">
                Apprendre à lire l&apos;arabe,
                <br />
                étape par étape
              </span>
            </h2>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-gray-600 md:mb-8 md:text-base">
              Un parcours clair et progressif pour maîtriser la lecture arabe
              avec confiance. Chaque étape est conçue pour vous permettre
              d&apos;avancer sereinement, sans vous sentir perdu.
            </p>

            {/* Étapes — mobile : timeline compacte */}
            <div className="md:hidden">
              <MethodStepsList variant="mobile" />
            </div>

            {/* Étapes — desktop */}
            <div className="hidden md:block">
              <MethodStepsList variant="desktop" />
            </div>
          </div>

          {/* Photo — desktop & tablette uniquement */}
          <div className="relative mx-auto hidden w-full max-w-lg md:block lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/home/methode-apprentissage.png"
                alt="Livres et cahiers d'apprentissage de la lecture arabe sur un bureau"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
