import { z } from "zod";
import { TESTIMONIAL_INVITE_DURATION_IDS } from "@/lib/testimonials/invite-duration";

export const testimonialInviteDurationSchema = z.enum(
  TESTIMONIAL_INVITE_DURATION_IDS,
  { message: "Choisissez une durée de lien." }
);

export type TestimonialInviteDurationInput = z.infer<
  typeof testimonialInviteDurationSchema
>;
