import Link from "next/link";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { LogoutButton } from "@/components/auth/LogoutButton";

type Props = {
  prenom: string;
  nom: string;
};

export function LearnerAreaHeader({ prenom, nom }: Props) {
  return (
    <header className="bg-primary text-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <BrandLogoMark size={32} />
          <span className="font-serif font-bold text-base sm:text-xl">
            ArabeSimplement
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-xs sm:text-sm text-gray-300 truncate hidden sm:inline">
            {prenom} {nom}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
