import type {
  Creneau,
  Formation,
  FormationSchedulingMode,
} from "@/types/domain.types";
import { creneauxForSchedulingMode } from "@/lib/scheduling-mode";

const LIMITED_CAPACITY_THRESHOLD = 4;

type CreneauCapacity = Pick<Creneau, "statut" | "placesMax"> & {
  _count?: { enrollments: number };
};

function enrollmentTaken(c: CreneauCapacity): number {
  return c._count?.enrollments ?? 0;
}

/** Pour le checkout serveur (objets Prisma avec comptages). */
export function creneauBookableFromCounts(
  statut: Creneau["statut"],
  placesMax: number,
  enrollmentsCount: number
): boolean {
  if (statut !== "OPEN") return false;
  return enrollmentsCount < placesMax;
}

/** Créneau sélectionnable (OPEN et places restantes). */
export function creneauIsBookable(c: CreneauCapacity): boolean {
  if (c.statut !== "OPEN") return false;
  const taken = enrollmentTaken(c);
  if (c._count?.enrollments === undefined) {
    return true;
  }
  return taken < c.placesMax;
}

/** Somme des capacités des créneaux (mode créneaux fixes). */
export function sumCreneauxPlacesMax(creneaux: Pick<Creneau, "placesMax">[]): number {
  return creneaux.reduce((s, c) => s + c.placesMax, 0);
}

/** Badge « Limité » : uniquement créneaux proposés, capacité totale &lt; 4. */
export function shouldShowLimitedBadgeForFixedSlots(
  mode: FormationSchedulingMode,
  creneaux: (Pick<Creneau, "placesMax"> & {
    schedulingMode?: FormationSchedulingMode | null;
  })[]
): boolean {
  if (mode !== "FIXED_SLOTS") return false;
  const modeSlots = creneauxForSchedulingMode(creneaux, "FIXED_SLOTS");
  if (modeSlots.length === 0) return false;
  const sum = sumCreneauxPlacesMax(modeSlots);
  return sum > 0 && sum < LIMITED_CAPACITY_THRESHOLD;
}

function formationHasRoom(
  placesMax: number | undefined | null,
  enrollmentCount: number,
  mode: FormationSchedulingMode
): boolean {
  if (mode === "FIXED_SLOTS") return true;
  if (placesMax == null) return true;
  return enrollmentCount < placesMax;
}

/**
 * Achat possible (liste ou fiche) : places formation si défini, sinon créneaux pour modes concernés.
 */
export function isFormationPurchasable(
  f: Pick<Formation, "statut" | "schedulingMode" | "placesMax">,
  creneaux: Creneau[],
  formationEnrollmentCount: number
): boolean {
  if (f.statut !== "ACTIVE") return false;
  if (!formationHasRoom(f.placesMax, formationEnrollmentCount, f.schedulingMode)) {
    return false;
  }

  const mode = f.schedulingMode;
  if (mode === "FIXED_SLOTS") {
    return creneauxForSchedulingMode(creneaux, "FIXED_SLOTS").some(
      creneauIsBookable
    );
  }
  return true;
}
