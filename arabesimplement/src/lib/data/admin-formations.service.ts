import { prisma } from "@/lib/prisma";

export async function getFormationAdminDetail(id: string) {
  return prisma.formation.findUnique({
    where: { id },
    include: {
      creneaux: { orderBy: { createdAt: "asc" } },
      _count: {
        select: { orderItems: true, enrollments: true },
      },
    },
  });
}
