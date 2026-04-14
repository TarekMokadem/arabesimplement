import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import type { StudentSex } from "@prisma/client";
import { getUserForAdminById } from "@/lib/data/admin.service";
import { getGroupedLearnerCoursesForAdmin } from "@/lib/data/learner-courses.service";
import { getWeeklySubscriptionsForLearner } from "@/lib/data/weekly-subscriptions.service";
import { WeeklySubscriptionsSection } from "@/components/auth/WeeklySubscriptionsSection";
import { LearnerCourseAssignmentForm } from "../LearnerCourseAssignmentForm";
import { AdminCourseWeeklyLineForm } from "../AdminCourseWeeklyLineForm";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { LearnerCourseDisplayGroup } from "@/lib/learner-course-groups";
import {
  formatCreneauSlotLine,
  normalizeJourneeSlots,
  parseJourneeSlotsFromJson,
} from "@/lib/creneau-display";
import { isDatabaseConfigured } from "@/lib/utils/database";

function detailLinesForGroup(group: LearnerCourseDisplayGroup): string[] {
  const lines: string[] = [];
  if (group.kind === "HOURLY") {
    lines.push(
      "Cours à la carte (particulier / din) : toutes les durées d’abonnement sont regroupées sur cette fiche."
    );
    if (group.hourlyBundleSummary) {
      lines.push(`Volume hebdomadaire : ${group.hourlyBundleSummary}`);
    }
    if (group.weeklyLines.length > 0) {
      for (const w of group.weeklyLines) {
        lines.push(
          `Stripe : ${w.hourlyMinutes} min × ${w.bundleQuantity} (prélèvement mensuel) — ${w.status}`
        );
      }
    }
    if (group.creneau?.nom) {
      lines.push(`Créneau associé (indicatif) : ${group.creneau.nom}`);
    }
  } else if (group.creneau) {
    const slots = normalizeJourneeSlots(
      parseJourneeSlotsFromJson(group.creneau.journeeSlots),
      {
        jours: group.creneau.jours,
        heureDebut: group.creneau.heureDebut,
        dureeMinutes: group.creneau.dureeMinutes,
      }
    );
    lines.push(
      `${group.creneau.nom} — ${slots.map(formatCreneauSlotLine).join(" · ")}`
    );
  } else {
    lines.push("Pas de créneau en base (forfait flexible ou en attente).");
  }
  return lines;
}

function kindLabel(group: LearnerCourseDisplayGroup): string {
  if (group.kind === "HOURLY") {
    return "Cours particulier / din — regroupé";
  }
  if (group.schedulingMode === "FIXED_SLOTS") {
    return "Créneaux fixes";
  }
  if (group.schedulingMode === "FLEXIBLE_FORMATION") {
    return "Forfait flexible";
  }
  return group.schedulingMode;
}

export default async function AdminLearnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isDatabaseConfigured()) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
          Configurez DATABASE_URL pour afficher la fiche élève.
        </p>
      </div>
    );
  }

  const user = await getUserForAdminById(id);
  if (!user) notFound();

  const courses =
    user.role === "STUDENT"
      ? await getGroupedLearnerCoursesForAdmin(user.id)
      : [];

  const weeklyDb =
    user.role === "STUDENT"
      ? await getWeeklySubscriptionsForLearner(user.id, {
          excludeCanceled: false,
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

  const learnerSexe: StudentSex | null = user.sexe ?? null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/utilisateurs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-3 -ml-2 text-primary"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Utilisateurs
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {user.prenom} {user.nom}
          </h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
          {user.telephone ? (
            <p className="text-sm text-gray-500">{user.telephone}</p>
          ) : null}
        </div>
        <Link
          href={`/admin/utilisateurs/${user.id}/modifier`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0 inline-flex gap-2"
          )}
        >
          <Pencil className="h-4 w-4" />
          Modifier le profil
        </Link>
      </div>

      {user.role !== "STUDENT" ? (
        <p className="text-sm text-gray-600">
          Ce compte n’est pas un élève — pas de cours à afficher.
        </p>
      ) : (
        <>
        {weeklyPanel.length > 0 ? (
          <section
            aria-labelledby="abonnements-cartes-admin"
            className="mb-10 space-y-3"
          >
            <h2
              id="abonnements-cartes-admin"
              className="font-serif text-xl font-semibold text-primary"
            >
              Abonnements cours à la carte (Stripe)
            </h2>
            <WeeklySubscriptionsSection
              rows={weeklyPanel}
              learnerSexe={learnerSexe}
              readOnly={false}
              adminMode
              adminLineSlot={(line) => (
                <AdminCourseWeeklyLineForm
                  courseWeeklySubscriptionId={line.id}
                  initialBundleQuantity={line.bundleQuantity}
                  initialHourlyMinutes={line.hourlyMinutes}
                />
              )}
            />
          </section>
        ) : null}
        <section aria-labelledby="cours-eleve-heading" className="space-y-6">
          <h2
            id="cours-eleve-heading"
            className="font-serif text-xl font-semibold text-primary"
          >
            Cours et suivi
          </h2>
          <p className="text-sm text-gray-600">
            Renseignez le professeur et le groupe WhatsApp pour chaque cours :
            l’élève les verra sur son tableau de bord. Les cours à la carte
            (plusieurs durées) sont regroupés en une seule ligne.
          </p>
          {courses.length === 0 ? (
            <p className="text-sm text-gray-500 border border-dashed rounded-lg p-6 text-center">
              Aucune inscription enregistrée pour cet élève.
            </p>
          ) : (
            <div className="space-y-6">
              {courses.map((group) => (
                <LearnerCourseAssignmentForm
                  key={group.key}
                  userId={user.id}
                  formationId={group.formationId}
                  isHourlyGroup={group.kind === "HOURLY"}
                  creneauId={group.creneauId}
                  formationTitre={group.formationTitre}
                  kindLabel={kindLabel(group)}
                  detailLines={detailLinesForGroup(group)}
                  initialProfessor={group.assignedProfessorName ?? ""}
                  initialWhatsapp={group.assignedWhatsappUrl ?? ""}
                />
              ))}
            </div>
          )}
        </section>
        </>
      )}
    </div>
  );
}
