import Link from "next/link";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

export type LearnerNavSection = "dashboard" | "history";

type Props = {
  prenom: string;
  nom: string;
  /** Page courante pour la mise en évidence des liens (navbar espace élève). */
  currentSection?: LearnerNavSection;
};

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm rounded-md px-3 py-2 transition-colors whitespace-nowrap",
        isActive
          ? "bg-white/20 text-white font-medium"
          : "text-gray-200 hover:text-white hover:bg-white/10"
      )}
    >
      {children}
    </Link>
  );
}

export function LearnerAreaHeader({
  prenom,
  nom,
  currentSection,
}: Props) {
  return (
    <header className="bg-primary text-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 w-fit"
          >
            <BrandLogoMark size={44} priority />
            <span className="font-serif font-bold text-base sm:text-xl">
              ArabeSimplement
            </span>
          </Link>

          <nav
            className="flex flex-wrap items-center gap-1 sm:gap-2 order-3 sm:order-2 sm:justify-center sm:flex-1"
            aria-label="Navigation espace élève"
          >
            <NavLink
              href="/tableau-de-bord"
              isActive={currentSection === "dashboard"}
            >
              Tableau de bord
            </NavLink>
            <NavLink
              href="/historique-achats"
              isActive={currentSection === "history"}
            >
              Historique d&apos;achats
            </NavLink>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-0 order-2 sm:order-3">
            <span className="text-xs sm:text-sm text-gray-300 truncate hidden sm:inline max-w-[12rem] md:max-w-none">
              {prenom} {nom}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
