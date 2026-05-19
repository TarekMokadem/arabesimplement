import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/auth/password-reset-crypto";

export type TestimonialInviteStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "used";

export async function getTestimonialInviteStatus(
  plainToken: string
): Promise<TestimonialInviteStatus> {
  const token = plainToken?.trim();
  if (!token || token.length < 20) return "invalid";

  const tokenHash = hashPasswordResetToken(token);
  const invite = await prisma.testimonialInvite.findUnique({
    where: { tokenHash },
    select: { expiresAt: true, usedAt: true },
  });

  if (!invite) return "invalid";
  if (invite.usedAt) return "used";
  if (invite.expiresAt.getTime() < Date.now()) return "expired";
  return "valid";
}
