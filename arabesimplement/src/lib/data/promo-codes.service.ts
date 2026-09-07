import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type AdminPromoCodeRow = {
  id: string;
  code: string;
  amountOffEuros: number;
  active: boolean;
  expiresAt: Date | null;
  maxRedemptions: number | null;
  redemptionCount: number;
  createdAt: Date;
};

export async function getPromoCodesForAdmin(): Promise<AdminPromoCodeRow[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    amountOffEuros: Number(r.amountOffEuros),
    active: r.active,
    expiresAt: r.expiresAt,
    maxRedemptions: r.maxRedemptions,
    redemptionCount: r.redemptionCount,
    createdAt: r.createdAt,
  }));
}
