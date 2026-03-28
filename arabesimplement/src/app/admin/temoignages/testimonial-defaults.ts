import type { AdminTestimonialWriteInput } from "@/lib/validations/admin-testimonial.schema";

export function getDefaultTestimonialValues(): AdminTestimonialWriteInput {
  return {
    nom: "",
    texte: "",
    note: 5,
    approuve: false,
  };
}
