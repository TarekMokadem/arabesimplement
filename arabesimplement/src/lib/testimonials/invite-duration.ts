/** Durées proposées à l’admin pour un lien d’avis élève. */
export const TESTIMONIAL_INVITE_DURATION_IDS = ["7d", "infinite"] as const;

export type TestimonialInviteDurationId =
  (typeof TESTIMONIAL_INVITE_DURATION_IDS)[number];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function isTestimonialInviteDurationId(
  value: string
): value is TestimonialInviteDurationId {
  return (TESTIMONIAL_INVITE_DURATION_IDS as readonly string[]).includes(value);
}

export function testimonialInviteDurationLabel(
  duration: TestimonialInviteDurationId
): string {
  return duration === "infinite" ? "Sans expiration" : "7 jours";
}

/** `null` = lien sans date de fin. */
export function expiresAtForInviteDuration(
  duration: TestimonialInviteDurationId,
  now: number = Date.now()
): Date | null {
  if (duration === "infinite") return null;
  return new Date(now + SEVEN_DAYS_MS);
}

export function isTestimonialInviteExpired(
  expiresAt: Date | null | undefined,
  now: number = Date.now()
): boolean {
  if (expiresAt == null) return false;
  return expiresAt.getTime() < now;
}
