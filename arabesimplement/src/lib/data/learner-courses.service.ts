import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  groupEnrollmentsForLearnerDisplay,
  type EnrollmentForGrouping,
  type LearnerCourseDisplayGroup,
  type WeeklySubLine,
} from "@/lib/learner-course-groups";

function mapWeeklyLine(r: {
  hourlyMinutes: number;
  bundleQuantity: number;
  status: string;
}): WeeklySubLine {
  return {
    hourlyMinutes: r.hourlyMinutes,
    bundleQuantity: r.bundleQuantity,
    status: r.status,
  };
}

async function loadEnrollmentRowsForUser(userId: string): Promise<
  EnrollmentForGrouping[]
> {
  const rows = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      formation: {
        select: { id: true, titre: true, slug: true, schedulingMode: true },
      },
      creneau: {
        select: {
          id: true,
          nom: true,
          jours: true,
          heureDebut: true,
          dureeMinutes: true,
          journeeSlots: true,
        },
      },
    },
  });

  return rows.map((e) => ({
    id: e.id,
    formationId: e.formationId,
    creneauId: e.creneauId,
    tokenUsed: e.tokenUsed,
    tokenExpiresAt: e.tokenExpiresAt,
    assignedProfessorName: e.assignedProfessorName,
    assignedWhatsappUrl: e.assignedWhatsappUrl,
    formation: e.formation,
    creneau: e.creneau,
  }));
}

async function weeklyMapForUser(userId: string): Promise<
  Map<string, WeeklySubLine[]>
> {
  const subs = await prisma.courseWeeklySubscription.findMany({
    where: { userId },
    select: {
      formationId: true,
      hourlyMinutes: true,
      bundleQuantity: true,
      status: true,
    },
  });
  const map = new Map<string, WeeklySubLine[]>();
  for (const s of subs) {
    const arr = map.get(s.formationId) ?? [];
    arr.push(mapWeeklyLine(s));
    map.set(s.formationId, arr);
  }
  return map;
}

export async function getGroupedLearnerCoursesForDashboard(
  userId: string
): Promise<LearnerCourseDisplayGroup[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const [enrollments, weeklyMap] = await Promise.all([
      loadEnrollmentRowsForUser(userId),
      weeklyMapForUser(userId),
    ]);
    return groupEnrollmentsForLearnerDisplay(enrollments, weeklyMap);
  } catch (e) {
    console.error("[getGroupedLearnerCoursesForDashboard]", e);
    return [];
  }
}

/** Même regroupement pour la fiche admin élève. */
export async function getGroupedLearnerCoursesForAdmin(
  userId: string
): Promise<LearnerCourseDisplayGroup[]> {
  return getGroupedLearnerCoursesForDashboard(userId);
}
