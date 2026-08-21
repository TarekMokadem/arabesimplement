import type { AdminTestimonialWriteInput } from "@/lib/validations/admin-testimonial.schema";

export function getDefaultTestimonialValues(): AdminTestimonialWriteInput {
  return {
    nom: "",
    kind: "TEXT",
    texte: "",
    audioUrl: "",
    note: 5,
    approuve: false,
  };
}
