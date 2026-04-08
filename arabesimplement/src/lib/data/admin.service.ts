import type { FormationStatus, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { parseBillingSnapshot } from "@/lib/orders/billing-snapshot";

export type AdminStats = {
  revenusThisMois: number;
  revenusPreviousMois: number;
  newStudents: number;
  newStudentsPrevious: number;
  formationsActives: number;
  paidOrdersThisMois: number;
};

export type AdminRecentOrder = {
  id: string;
  userLabel: string;
  formationLabel: string;
  amount: number;
  dateIso: string;
  status: OrderStatus;
};

export type AdminCreneauOccupancy = {
  id: string;
  label: string;
  current: number;
  max: number;
};

export type AdminActivityEntry = {
  id: string;
  text: string;
  timeLabel: string;
};

export type AdminFormationRow = {
  id: string;
  titre: string;
  slug: string;
  prix: number;
  prixPromo: number | null;
  statut: FormationStatus;
  inscrits: number;
  imageUrl: string | null;
};

export type AdminUserRow = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  role: "STUDENT" | "ADMIN";
  formationsCount: number;
  createdAt: Date;
};

export type AdminPaymentRow = {
  id: string;
  userLabel: string;
  formationLabel: string;
  montant: number;
  statut: OrderStatus;
  date: Date;
  /** Si renseigné, la commande est un abonnement Stripe — ne pas utiliser le marquage manuel. */
  stripeSubscriptionId: string | null;
};

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function previousMonthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}

function orderUserLabel(
  user: { prenom: string; nom: string } | null,
  billingSnapshot: unknown
): string {
  if (user) {
    return `${user.prenom} ${user.nom.charAt(0)}.`;
  }
  const snap = parseBillingSnapshot(billingSnapshot);
  if (snap) {
    return `${snap.prenom} ${snap.nom.charAt(0)}. (facturation)`;
  }
  return "—";
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString("fr-FR");
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!isDatabaseConfigured()) {
    return {
      revenusThisMois: 0,
      revenusPreviousMois: 0,
      newStudents: 0,
      newStudentsPrevious: 0,
      formationsActives: 0,
      paidOrdersThisMois: 0,
    };
  }

  const now = new Date();
  const thisMonth = startOfMonth(now);
  const prevMonth = previousMonthStart(now);

  const [
    revThisAgg,
    revPrevAgg,
    newStudents,
    newStudentsPrevious,
    formationsActives,
    paidOrdersThisMois,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        statut: "PAID",
        createdAt: { gte: thisMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        statut: "PAID",
        createdAt: { gte: prevMonth, lt: thisMonth },
      },
      _sum: { total: true },
    }),
    prisma.user.count({
      where: { role: "STUDENT", createdAt: { gte: thisMonth } },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: prevMonth, lt: thisMonth },
      },
    }),
    prisma.formation.count({ where: { statut: "ACTIVE" } }),
    prisma.order.count({
      where: { statut: "PAID", createdAt: { gte: thisMonth } },
    }),
  ]);

  return {
    revenusThisMois: Number(revThisAgg._sum.total ?? 0),
    revenusPreviousMois: Number(revPrevAgg._sum.total ?? 0),
    newStudents,
    newStudentsPrevious,
    formationsActives,
    paidOrdersThisMois,
  };
}

export async function getAdminRecentOrders(
  limit = 5
): Promise<AdminRecentOrder[]> {
  if (!isDatabaseConfigured()) return [];
  const orders = await prisma.order.findMany({
    where: { statut: { in: ["PAID", "REFUNDED", "FAILED"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { prenom: true, nom: true } },
      orderItems: {
        include: { formation: { select: { titre: true } } },
      },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    userLabel: orderUserLabel(o.user, o.billingSnapshot),
    formationLabel: o.orderItems.map((i) => i.formation.titre).join(", "),
    amount: Number(o.total),
    dateIso: o.createdAt.toISOString().slice(0, 10),
    status: o.statut,
  }));
}

export async function getAdminCreneauOccupancy(
  limit = 12
): Promise<AdminCreneauOccupancy[]> {
  if (!isDatabaseConfigured()) return [];
  const creneaux = await prisma.creneau.findMany({
    orderBy: { createdAt: "asc" },
    take: limit,
    include: {
      formation: { select: { titre: true } },
      _count: { select: { enrollments: true } },
    },
  });
  return creneaux.map((c) => ({
    id: c.id,
    label: `${c.nom} — ${c.formation.titre}`,
    current: c._count.enrollments,
    max: c.placesMax,
  }));
}

export async function getAdminRecentActivity(
  limit = 6
): Promise<AdminActivityEntry[]> {
  if (!isDatabaseConfigured()) return [];

  const [enrollments, messages, orders] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { prenom: true, nom: true } },
        formation: { select: { titre: true } },
      },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.order.findMany({
      where: { statut: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { user: { select: { prenom: true, nom: true } } },
    }),
  ]);

  type Tagged = { at: Date; entry: AdminActivityEntry };
  const items: Tagged[] = [];

  for (const e of enrollments) {
    items.push({
      at: e.createdAt,
      entry: {
        id: `enr-${e.id}`,
        text: `${e.user.prenom} ${e.user.nom.charAt(0)}. — inscription « ${e.formation.titre} »`,
        timeLabel: formatRelativeTime(e.createdAt),
      },
    });
  }
  for (const m of messages) {
    items.push({
      at: m.createdAt,
      entry: {
        id: `msg-${m.id}`,
        text: `Message de ${m.nom} : ${m.sujet}`,
        timeLabel: formatRelativeTime(m.createdAt),
      },
    });
  }
  for (const o of orders) {
    const label = orderUserLabel(o.user, o.billingSnapshot);
    items.push({
      at: o.createdAt,
      entry: {
        id: `ord-${o.id}`,
        text: `Paiement reçu de ${label} (${Number(o.total)} €)`,
        timeLabel: formatRelativeTime(o.createdAt),
      },
    });
  }

  items.sort((a, b) => b.at.getTime() - a.at.getTime());
  return items.slice(0, limit).map((t) => t.entry);
}

export async function getAdminFormationsList(): Promise<AdminFormationRow[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.formation.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });
  return rows.map((f) => ({
    id: f.id,
    titre: f.titre,
    slug: f.slug,
    prix: Number(f.prix),
    prixPromo: f.prixPromo ? Number(f.prixPromo) : null,
    statut: f.statut,
    inscrits: f._count.enrollments,
    imageUrl: f.imageUrl,
  }));
}

export async function getAdminUserList(): Promise<AdminUserRow[]> {
  if (!isDatabaseConfigured()) return [];
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });
  return users.map((u) => ({
    id: u.id,
    prenom: u.prenom,
    nom: u.nom,
    email: u.email,
    telephone: u.telephone,
    role: u.role,
    formationsCount: u._count.enrollments,
    createdAt: u.createdAt,
  }));
}

export async function getUserForAdminById(id: string) {
  if (!isDatabaseConfigured()) return null;
  return prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { orders: true, enrollments: true } },
    },
  });
}

export async function getAdminOrdersList(): Promise<AdminPaymentRow[]> {
  if (!isDatabaseConfigured()) return [];
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { prenom: true, nom: true } },
      orderItems: {
        include: { formation: { select: { titre: true } } },
      },
    },
  });
  return orders.map((o) => ({
    id: o.id,
    userLabel: orderUserLabel(o.user, o.billingSnapshot),
    formationLabel: o.orderItems.map((i) => i.formation.titre).join(", "),
    montant: Number(o.total),
    statut: o.statut,
    date: o.createdAt,
    stripeSubscriptionId: o.stripeSubscriptionId,
  }));
}
