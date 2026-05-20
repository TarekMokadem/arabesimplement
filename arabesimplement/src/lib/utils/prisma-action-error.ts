import { Prisma } from "@prisma/client";

/** Message utilisateur à partir d’une erreur Prisma (actions serveur). */
export function prismaActionErrorMessage(
  e: unknown,
  fallback: string
): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2021") {
      return (
        "La base n’est pas à jour (table manquante). Exécutez « npm run db:migrate » " +
        "sur l’environnement concerné, ou redéployez après mise à jour du build."
      );
    }
    if (e.code === "P1001" || e.code === "P1002") {
      return "Connexion à la base impossible. Vérifiez DATABASE_URL.";
    }
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return "Base de données non accessible. Vérifiez DATABASE_URL.";
  }
  console.error("[prismaActionError]", e);
  return fallback;
}
