import { z } from "zod";

export const adminTestimonialWriteSchema = z
  .object({
    nom: z.string().min(2, "Nom trop court"),
    kind: z.enum(["TEXT", "AUDIO"]),
    texte: z.string(),
    audioUrl: z.string().optional(),
    note: z.coerce.number().int().min(1).max(5),
    approuve: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "TEXT") {
      if (data.texte.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Texte trop court (10 caractères min.)",
          path: ["texte"],
        });
      }
      return;
    }
    if (!data.audioUrl?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ajoutez un fichier audio",
        path: ["audioUrl"],
      });
    }
  });

export type AdminTestimonialWriteInput = z.infer<
  typeof adminTestimonialWriteSchema
>;
