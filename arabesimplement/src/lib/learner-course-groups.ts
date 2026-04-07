import type { FormationSchedulingMode } from "@/types/domain.types";
import {
  HOURLY_BUNDLE_MINUTES,
  emptyHourlyBundle,
  formatHourlyBundleForDisplay,
  type HourlyDurationBundle,
} from "@/lib/scheduling-mode";

export type LearnerCreneauSummary = {
  id: string | null;
  nom: string | null;
  jours: string[];
  heureDebut: string;
  dureeMinutes: number;
  journeeSlots: unknown;
} | null;

export type EnrollmentForGrouping = {
  id: string;
  formationId: string;
  creneauId: string | null;
  tokenUsed: boolean;
  tokenExpiresAt: Date;
  assignedProfessorName: string | null;
  assignedWhatsappUrl: string | null;
  formation: {
    id: string;
    titre: string;
    slug: string;
    schedulingMode: FormationSchedulingMode;
  };
  creneau: LearnerCreneauSummary;
};

export type WeeklySubLine = {
  hourlyMinutes: number;
  bundleQuantity: number;
  status: string;
};

/** Une ligne d’affichage : cours regroupé (hourly) ou inscription avec créneau. */
export type LearnerCourseDisplayGroup = {
  key: string;
  kind: "HOURLY" | "SLOT";
  formationId: string;
  formationTitre: string;
  formationSlug: string;
  schedulingMode: FormationSchedulingMode;
  enrollmentIds: string[];
  creneauId: string | null;
  creneau: LearnerCreneauSummary;
  /** Synthèse abonnement hebdo (cours particulier / din). */
  hourlyBundleSummary: string | null;
  weeklyLines: WeeklySubLine[];
  assignedProfessorName: string | null;
  assignedWhatsappUrl: string | null;
  tokenUsed: boolean;
  tokenExpiresAt: Date;
};

function firstNonEmptyString(
  rows: (string | null | undefined)[]
): string | null {
  for (const s of rows) {
    if (s != null && String(s).trim() !== "") return String(s).trim();
  }
  return null;
}

function mergeHourlyBundleFromWeekly(
  lines: WeeklySubLine[]
): HourlyDurationBundle {
  const bundle = emptyHourlyBundle() as HourlyDurationBundle;
  for (const line of lines) {
    const m = line.hourlyMinutes;
    if (
      !HOURLY_BUNDLE_MINUTES.includes(
        m as (typeof HOURLY_BUNDLE_MINUTES)[number]
      )
    )
      continue;
    const key = m as 60 | 40 | 30;
    bundle[key] = (bundle[key] ?? 0) + Math.max(0, line.bundleQuantity);
  }
  return bundle;
}

function hourlySummaryFromWeekly(lines: WeeklySubLine[]): string | null {
  if (lines.length === 0) return null;
  const bundle = mergeHourlyBundleFromWeekly(lines);
  const s = formatHourlyBundleForDisplay(bundle, { omitPrice: true });
  return s || null;
}

/** Regroupe les inscriptions : une entrée par formation en HOURLY ; sinon une entrée par inscription. */
export function groupEnrollmentsForLearnerDisplay(
  enrollments: EnrollmentForGrouping[],
  weeklyByFormationId: Map<string, WeeklySubLine[]>
): LearnerCourseDisplayGroup[] {
  const hourlyBuckets = new Map<string, EnrollmentForGrouping[]>();
  const usedIds = new Set<string>();

  for (const e of enrollments) {
    if (e.formation.schedulingMode === "HOURLY_PURCHASE") {
      const arr = hourlyBuckets.get(e.formationId) ?? [];
      arr.push(e);
      hourlyBuckets.set(e.formationId, arr);
    }
  }

  const out: LearnerCourseDisplayGroup[] = [];

  for (const [, rows] of hourlyBuckets) {
    for (const r of rows) usedIds.add(r.id);
    const formation = rows[0]!.formation;
    const weekly = weeklyByFormationId.get(formation.id) ?? [];
    const prof = firstNonEmptyString(rows.map((r) => r.assignedProfessorName));
    const wa = firstNonEmptyString(rows.map((r) => r.assignedWhatsappUrl));
    const tokenUsed = rows.every((r) => r.tokenUsed);
    const tokenExpiresAt = new Date(
      Math.max(...rows.map((r) => r.tokenExpiresAt.getTime()))
    );
    const creneau = rows.find((r) => r.creneau?.nom)?.creneau ?? rows[0]!.creneau;
    const creneauIds = [...new Set(rows.map((r) => r.creneauId).filter(Boolean))];
    const creneauId = creneauIds.length === 1 ? creneauIds[0]! : null;

    out.push({
      key: `hourly:${formation.id}`,
      kind: "HOURLY",
      formationId: formation.id,
      formationTitre: formation.titre,
      formationSlug: formation.slug,
      schedulingMode: formation.schedulingMode,
      enrollmentIds: rows.map((r) => r.id),
      creneauId,
      creneau,
      hourlyBundleSummary: hourlySummaryFromWeekly(weekly),
      weeklyLines: weekly,
      assignedProfessorName: prof,
      assignedWhatsappUrl: wa,
      tokenUsed,
      tokenExpiresAt,
    });
  }

  for (const e of enrollments) {
    if (usedIds.has(e.id)) continue;
    const f = e.formation;
    out.push({
      key: `slot:${e.id}`,
      kind: "SLOT",
      formationId: f.id,
      formationTitre: f.titre,
      formationSlug: f.slug,
      schedulingMode: f.schedulingMode,
      enrollmentIds: [e.id],
      creneauId: e.creneauId,
      creneau: e.creneau,
      hourlyBundleSummary: null,
      weeklyLines: weeklyByFormationId.get(f.id) ?? [],
      assignedProfessorName: e.assignedProfessorName,
      assignedWhatsappUrl: e.assignedWhatsappUrl,
      tokenUsed: e.tokenUsed,
      tokenExpiresAt: e.tokenExpiresAt,
    });
  }

  out.sort((a, b) => a.formationTitre.localeCompare(b.formationTitre, "fr"));
  return out;
}
