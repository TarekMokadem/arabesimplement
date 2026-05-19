import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/app/(auth)/actions";
import { getTestimonialInviteStatus } from "@/lib/data/testimonial-invites.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { StudentTestimonialForm } from "./StudentTestimonialForm";

export const metadata: Metadata = {
  title: "Donner son avis",
  description:
    "Partagez votre expérience avec ArabeSimplement. Votre témoignage sera publié après validation.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function DonnerSonAvisPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token.trim() : "";
  const session = await getSession();
  const defaultNom = session?.prenom?.trim() ?? "";

  let inviteStatus: Awaited<ReturnType<typeof getTestimonialInviteStatus>> =
    "invalid";
  if (isDatabaseConfigured() && token) {
    inviteStatus = await getTestimonialInviteStatus(token);
  }

  return (
    <div className="pb-16">
      <PageHeader
        title="Donner son avis"
        subtitle="Votre retour compte pour la communauté ArabeSimplement."
      />
      <div className="container mx-auto px-4 -mt-4">
        {!isDatabaseConfigured() && (
          <p className="text-center text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-lg mx-auto">
            Service temporairement indisponible.
          </p>
        )}
        {isDatabaseConfigured() && !token && (
          <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
            Ce lien est incomplet. Utilisez le lien personnel que l&apos;équipe
            vous a envoyé par e-mail ou message.
          </p>
        )}
        {isDatabaseConfigured() && token && inviteStatus === "invalid" && (
          <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
            Ce lien n&apos;est pas valide. Contactez l&apos;équipe pour en
            obtenir un nouveau.
          </p>
        )}
        {isDatabaseConfigured() && token && inviteStatus === "expired" && (
          <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
            Ce lien a expiré.{" "}
            <Link href="/contactez-nous" className="text-secondary underline">
              Contactez-nous
            </Link>{" "}
            pour recevoir un nouveau lien.
          </p>
        )}
        {isDatabaseConfigured() && token && inviteStatus === "used" && (
          <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
            Un avis a déjà été envoyé avec ce lien. Merci pour votre
            participation.
          </p>
        )}
        {isDatabaseConfigured() && token && inviteStatus === "valid" && (
          <StudentTestimonialForm token={token} defaultNom={defaultNom} />
        )}
      </div>
    </div>
  );
}
