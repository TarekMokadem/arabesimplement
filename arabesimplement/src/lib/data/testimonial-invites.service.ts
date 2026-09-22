import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/auth/password-reset-crypto";
import { isTestimonialInviteExpired } from "@/lib/testimonials/invite-duration";

export type TestimonialInviteStatus = "valid" | "invalid" | "expired";

export async function getTestimonialInviteStatus(
  plainToken: string
): Promise<TestimonialInviteStatus> {
  const token = plainToken?.trim();
  if (!token || token.length < 20) return "invalid";

  const tokenHash = hashPasswordResetToken(token);
  const invite = await prisma.testimonialInvite.findUnique({
    where: { tokenHash },
    select: { expiresAt: true },
  });

  if (!invite) return "invalid";
  if (isTestimonialInviteExpired(invite.expiresAt)) return "expired";
  return "valid";
}
