import { z } from "zod";

export const adminTestimonialWriteSchema = z.object({
  nom: z.string().min(2, "Nom trop court"),
  texte: z.string().min(10, "Texte trop court"),
  note: z.coerce.number().int().min(1).max(5),
  approuve: z.boolean(),
});

export type AdminTestimonialWriteInput = z.infer<
  typeof adminTestimonialWriteSchema
>;
