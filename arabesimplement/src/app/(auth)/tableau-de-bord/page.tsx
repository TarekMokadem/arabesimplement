import Link from "next/link";
import type { StudentSex } from "@prisma/client";
import { BookOpen, Calendar, MessageCircle, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  learnerFormationWhatsAppUrl,
  learnerWhatsAppCoachLabel,
} from "@/lib/contact/learner-whatsapp";
import { LearnerAreaHeader } from "@/components/auth/LearnerAreaHeader";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "../actions";
import { LearnerSexeForm } from "./LearnerSexeForm";
import { LearnerProfileForm } from "@/components/auth/LearnerProfileForm";
import { RequestPasswordChangeButton } from "@/components/auth/RequestPasswordChangeButton";
import { getGroupedLearnerCoursesForDashboard } from "@/lib/data/learner-courses.service";
import { normalizeWhatsappHref } from "@/lib/utils/whatsapp-link";
import { getWeeklySubscriptionsForLearner } from "@/lib/data/weekly-subscriptions.service";
import { WeeklySubscriptionsSection } from "@/components/auth/WeeklySubscriptionsSection";
import {
  formatCreneauSlotLine,
  normalizeJourneeSlots,
  parseJourneeSlotsFromJson,
} from "@/lib/creneau-display";

function creneauContactHref(formationTitre: string): string {
  const sujet = encodeURIComponent(`Créneau — ${formationTitre}`);
  return `/contactez-nous?sujet=${sujet}`;
}

export default async function TableauDeBordPage() {
  const session = await getSession();
  const user = session
    ? { prenom: session.prenom, nom: session.nom, email: session.email }
    : { prenom: "Invité", nom: "", email: "" };

  const courseGroups = session
    ? await getGroupedLearnerCoursesForDashboard(session.id)
    : [];

  let learnerSexe: StudentSex | null = null;
  let learnerTelephone = "";
  if (session && isDatabaseConfigured()) {
    const row = await prisma.user.findUnique({
      where: { id: session.id },
      select: { sexe: true, telephone: true },
    });
    learnerSexe = row?.sexe ?? null;
    learnerTelephone = row?.telephone ?? "";
  }

  const weeklyDb = session
    ? await getWeeklySubscriptionsForLearner(session.id, {
        excludeCanceled: true,
      })
    : [];
  const weeklyPanel = weeklyDb.map((r) => ({
    id: r.id,
    formationId: r.formationId,
    stripeSubscriptionId: r.stripeSubscriptionId,
    status: r.status,
    hourlyMinutes: r.hourlyMinutes,
    bundleQuantity: r.bundleQuantity,
    currentPeriodEnd: r.currentPeriodEnd?.toISOString() ?? null,
    formation: { titre: r.formation.titre },
  }));

  return (
    <div className="min-h-screen bg-surface">
      <LearnerAreaHeader prenom={user.prenom} nom={user.nom} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2">
            Assalamou alaykoum, {user.prenom} !
          </h1>
          <p className="text-gray-600">
            Bienvenue dans votre espace apprenant.
          </p>
        </div>

        <section
          id="abonnements-hebdo"
          className="mb-8 scroll-mt-24"
          aria-labelledby="titre-abonnements-hebdo"
        >
          <h2 id="titre-abonnements-hebdo" className="sr-only">
            Abonnements cours à la carte
          </h2>
          {weeklyPanel.length > 0 ? (
            <WeeklySubscriptionsSection
              rows={weeklyPanel}
              learnerSexe={learnerSexe}
            />
          ) : (
            <Card className="bg-white border-dashed border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Cours à la carte — abonnements
                </CardTitle>
                <CardDescription>
                  Lorsque vous souscrivez un cours à la carte avec prélèvement
                  chaque semaine, vous le retrouvez ici. Vous pourrez mettre en
                  pause, reprendre ou arrêter sans contacter le support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Vous n&apos;avez pas encore d&apos;abonnement actif de ce
                  type.
                </p>
                <Link
                  href="/boutique"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-primary text-primary inline-flex w-fit"
                  )}
                >
                  Voir la boutique
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Formations */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Mes formations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseGroups.map((group) => {
                  const titre = group.formationTitre;
                  const coachWaUrl = learnerFormationWhatsAppUrl(
                    learnerSexe,
                    titre
                  );
                  const coachWaLabel = learnerWhatsAppCoachLabel(learnerSexe);
                  const coursWaHref = group.assignedWhatsappUrl
                    ? normalizeWhatsappHref(group.assignedWhatsappUrl)
                    : null;
                  return (
                  <div
                    key={group.key}
                    className="p-4 border rounded-lg hover:border-secondary/30 transition-colors"
                    data-testid={`learner-course-${group.key}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium text-primary">
                          {titre}
                        </h3>
                        {group.kind === "HOURLY" &&
                          group.hourlyBundleSummary && (
                            <p className="mt-1 text-sm text-gray-600">
                              Abonnement : {group.hourlyBundleSummary} / semaine
                            </p>
                          )}
                        {group.creneau ? (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>
                              {group.creneau.nom} —{" "}
                              {normalizeJourneeSlots(
                                parseJourneeSlotsFromJson(
                                  group.creneau.journeeSlots
                                ),
                                {
                                  jours: group.creneau.jours,
                                  heureDebut: group.creneau.heureDebut,
                                  dureeMinutes: group.creneau.dureeMinutes,
                                }
                              )
                                .map(formatCreneauSlotLine)
                                .join(" · ")}
                            </span>
                          </div>
                        ) : group.kind === "SLOT" ? (
                          <div className="mt-2">
                            <Link href={creneauContactHref(titre)}>
                              <Button
                                size="sm"
                                className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                              >
                                Choisir mon créneau
                              </Button>
                            </Link>
                          </div>
                        ) : null}
                        {group.assignedProfessorName ? (
                          <p className="mt-3 text-sm font-medium text-primary">
                            Professeur : {group.assignedProfessorName}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2">
                          {coursWaHref ? (
                            <Link
                              href={coursWaHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                buttonVariants({
                                  size: "sm",
                                  variant: "default",
                                }),
                                "bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2"
                              )}
                            >
                              <MessageCircle className="h-4 w-4 shrink-0" />
                              Groupe WhatsApp du cours
                            </Link>
                          ) : null}
                          {coachWaUrl ? (
                            <Link
                              href={coachWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                buttonVariants({
                                  size: "sm",
                                  variant: "outline",
                                }),
                                "border-emerald-600 text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-2"
                              )}
                            >
                              <MessageCircle className="h-4 w-4 shrink-0" />
                              WhatsApp — {coachWaLabel}
                            </Link>
                          ) : null}
                          {!coursWaHref && !coachWaUrl && learnerSexe ? (
                            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                              Le lien WhatsApp de votre équipe n’est pas encore
                              configuré. Utilisez{" "}
                              <Link
                                href="/contactez-nous"
                                className="underline font-medium"
                              >
                                la page contact
                              </Link>
                              .
                            </p>
                          ) : null}
                          {!coursWaHref && !coachWaUrl && !learnerSexe ? (
                            <p className="text-xs text-gray-600">
                              Pour afficher le bon numéro WhatsApp (équipe
                              féminine ou masculine), indiquez votre sexe dans
                              « Mes informations » ou{" "}
                              <Link
                                href="/contactez-nous"
                                className="text-secondary underline font-medium"
                              >
                                contactez-nous
                              </Link>
                              .
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <Badge
                        className={
                          group.tokenUsed
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary/10 text-secondary"
                        }
                      >
                        {group.tokenUsed
                          ? "Inscrit"
                          : group.creneau
                            ? "Créneau choisi"
                            : "En attente"}
                      </Badge>
                    </div>
                  </div>
                );
                })}

                {courseGroups.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Vous n&apos;avez pas encore de formation. Les achats
                      validés apparaissent ici après paiement.
                    </p>
                    <Link href="/boutique">
                      <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                        Découvrir nos formations
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" />
                  Mes informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500">E-mail (non modifiable)</span>
                  <p className="font-medium text-primary break-all">{user.email}</p>
                </div>
                {session ? (
                  <>
                    <LearnerProfileForm
                      key={`${user.prenom}-${user.nom}-${learnerTelephone}`}
                      initialPrenom={user.prenom}
                      initialNom={user.nom}
                      initialTelephone={learnerTelephone}
                      disabled={!isDatabaseConfigured()}
                    />
                    <LearnerSexeForm
                      initialSexe={learnerSexe}
                      disabled={!isDatabaseConfigured()}
                    />
                    <RequestPasswordChangeButton
                      disabled={!isDatabaseConfigured()}
                    />
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Liens utiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/boutique"
                  className="block p-3 rounded-lg hover:bg-surface transition-colors text-primary"
                >
                  Voir les formations
                </Link>
                <Link
                  href="/historique-achats"
                  className="block p-3 rounded-lg hover:bg-surface transition-colors text-primary"
                >
                  Historique d&apos;achats
                </Link>
                <Link
                  href="/contactez-nous"
                  className="block p-3 rounded-lg hover:bg-surface transition-colors text-primary"
                >
                  Nous contacter
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
