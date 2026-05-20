import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/app/(auth)/actions";
import { getTestimonialInviteStatus } from "@/lib/data/testimonial-invites.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { StudentTestimonialForm } from "./StudentTestimonialForm";
import { TestimonialThankYouCard } from "./TestimonialThankYouCard";

export const metadata: Metadata = {
  title: "Donner son avis",
  description:
    "Partagez votre expérience avec ArabeSimplement. Votre témoignage sera publié après validation.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string; sent?: string }>;
};

export default async function DonnerSonAvisPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token.trim() : "";
  const sentConfirmed = sp.sent === "1";
  const session = await getSession();
  const defaultNom = session?.prenom?.trim() ?? "";

  let inviteStatus: Awaited<ReturnType<typeof getTestimonialInviteStatus>> =
    "invalid";
  if (isDatabaseConfigured() && token) {
    inviteStatus = await getTestimonialInviteStatus(token);
  }

  const showThankYou =
    isDatabaseConfigured() &&
    token &&
    (sentConfirmed || inviteStatus === "used");

  return (
    <div className="pt-20 pb-16">
      <PageHeader
        title="Donner son avis"
        subtitle="Votre retour compte pour la communauté ArabeSimplement."
      />

      <section className="py-10 sm:py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {!isDatabaseConfigured() && (
            <p className="text-center text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Service temporairement indisponible.
            </p>
          )}
          {isDatabaseConfigured() && !token && (
            <p className="text-center text-gray-600 text-sm">
              Ce lien est incomplet. Utilisez le lien personnel que l&apos;équipe
              vous a envoyé par e-mail ou message.
            </p>
          )}
          {isDatabaseConfigured() && token && inviteStatus === "invalid" && (
            <p className="text-center text-gray-600 text-sm">
              Ce lien n&apos;est pas valide. Contactez l&apos;équipe pour en
              obtenir un nouveau.
            </p>
          )}
          {isDatabaseConfigured() && token && inviteStatus === "expired" && (
            <p className="text-center text-gray-600 text-sm">
              Ce lien a expiré.{" "}
              <Link href="/contactez-nous" className="text-secondary underline">
                Contactez-nous
              </Link>{" "}
              pour recevoir un nouveau lien.
            </p>
          )}
          {showThankYou && <TestimonialThankYouCard />}
          {isDatabaseConfigured() &&
            token &&
            inviteStatus === "valid" &&
            !sentConfirmed && (
              <StudentTestimonialForm token={token} defaultNom={defaultNom} />
            )}
        </div>
      </section>
    </div>
  );
}
