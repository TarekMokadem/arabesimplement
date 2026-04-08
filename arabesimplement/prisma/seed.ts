import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";
import { MOCK_FORMATIONS_BY_SLUG } from "../src/lib/data/formations.mock";
import { hashPassword } from "../src/lib/auth/password";

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  loadEnv({ path: envPath });
  console.log("[seed] Variables chargées depuis :", envPath);
} else {
  console.warn("[seed] Aucun fichier .env à :", envPath);
}

async function main() {
  const { prisma } = await import("../src/lib/prisma");
  const featuredExpires = new Date();
  featuredExpires.setDate(featuredExpires.getDate() + 7);

  for (const formation of Object.values(MOCK_FORMATIONS_BY_SLUG)) {
    const { creneaux, description } = formation;

    await prisma.formation.upsert({
      where: { slug: formation.slug },
      create: {
        id: formation.id,
        slug: formation.slug,
        titre: formation.titre,
        descriptionCourte: formation.descriptionCourte,
        description: description?.trim() ? description.trim() : null,
        prix: formation.prix,
        prixPromo: formation.prixPromo ?? null,
        imageUrl: formation.imageUrl ?? null,
        placesMax: formation.placesMax ?? null,
        theme: formation.theme,
        schedulingMode: formation.schedulingMode,
        statut: formation.statut,
        featured: formation.featured,
        featuredTitre: formation.featuredTitre ?? null,
        featuredContent: formation.featuredContent ?? null,
        featuredBadge: formation.featuredBadge ?? null,
        featuredExpiresAt:
          formation.slug === "formation-tajwid" ? featuredExpires : null,
      },
      update: {
        titre: formation.titre,
        descriptionCourte: formation.descriptionCourte,
        description: description?.trim() ? description.trim() : null,
        prix: formation.prix,
        prixPromo: formation.prixPromo ?? null,
        imageUrl: formation.imageUrl ?? null,
        placesMax: formation.placesMax ?? null,
        theme: formation.theme,
        schedulingMode: formation.schedulingMode,
        statut: formation.statut,
        featured: formation.featured,
        featuredTitre: formation.featuredTitre ?? null,
        featuredContent: formation.featuredContent ?? null,
        featuredBadge: formation.featuredBadge ?? null,
        featuredExpiresAt:
          formation.slug === "formation-tajwid"
            ? featuredExpires
            : (formation.featuredExpiresAt ?? null),
      },
    });

    for (const c of creneaux) {
      const journeeSlots =
        c.journeeSlots ??
        c.jours.map((jour) => ({
          jour,
          heureDebut: c.heureDebut,
          dureeMinutes: c.dureeMinutes,
        }));
      await prisma.creneau.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          formationId: formation.id,
          nom: c.nom,
          jours: c.jours,
          journeeSlots,
          heureDebut: c.heureDebut,
          dureeMinutes: c.dureeMinutes,
          placesMax: c.placesMax,
          whatsappLink: c.whatsappLink ?? null,
          statut: c.statut,
        },
        update: {
          formationId: formation.id,
          nom: c.nom,
          jours: c.jours,
          journeeSlots,
          heureDebut: c.heureDebut,
          dureeMinutes: c.dureeMinutes,
          placesMax: c.placesMax,
          whatsappLink: c.whatsappLink ?? null,
          statut: c.statut,
        },
      });
    }
  }

  const seedTestimonials = [
    {
      id: "a0000001-0000-4000-8000-000000000001",
      nom: "Fatima B.",
      texte:
        "Alhamdulillah, grâce à ArabeSimplement j'ai appris à lire l'arabe en quelques semaines seulement. La méthode est vraiment efficace et le professeur très pédagogue.",
      note: 5,
      approuve: true,
    },
    {
      id: "a0000001-0000-4000-8000-000000000002",
      nom: "Youssef M.",
      texte:
        "Je recommande vivement cette formation ! Après des années à essayer d'apprendre seul, j'ai enfin trouvé une méthode qui fonctionne.",
      note: 5,
      approuve: true,
    },
    {
      id: "a0000001-0000-4000-8000-000000000003",
      nom: "Khadija L.",
      texte:
        "Le suivi personnalisé fait vraiment la différence. Le groupe WhatsApp permet de poser ses questions et de rester motivée. Très satisfaite !",
      note: 5,
      approuve: true,
    },
    {
      id: "a0000001-0000-4000-8000-000000000004",
      nom: "Omar S.",
      texte:
        "Formation excellente, j'ai pu enfin comprendre les bases de la lecture arabe. Les cours sont clairs et bien structurés.",
      note: 4,
      approuve: true,
    },
    {
      id: "a0000001-0000-4000-8000-000000000005",
      nom: "Nadia K.",
      texte:
        "Formation très complète. J'aimerais voir plus d'exercices audio — sinon rien à redire. Barakallahu fik !",
      note: 5,
      approuve: false,
    },
    {
      id: "a0000001-0000-4000-8000-000000000006",
      nom: "Ibrahim T.",
      texte:
        "Excellent rapport qualité-prix. Je propose quelques fiches récap en PDF à la fin de chaque module.",
      note: 4,
      approuve: false,
    },
  ] as const;

  for (const t of seedTestimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        nom: t.nom,
        texte: t.texte,
        note: t.note,
        approuve: t.approuve,
      },
      update: {
        nom: t.nom,
        texte: t.texte,
        note: t.note,
        approuve: t.approuve,
      },
    });
  }
  console.log("[seed] Témoignages :", seedTestimonials.length, "entrées (upsert)");

  const adminEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const adminPassword =
    process.env.ADMIN_SEED_PASSWORD?.replace(/\r$/, "").trim() ?? "";

  if (!adminEmail && !adminPassword) {
    console.log(
      "[seed] Admin : ignoré (définissez ADMIN_SEED_EMAIL et ADMIN_SEED_PASSWORD dans .env)."
    );
  } else if (adminEmail && !adminPassword) {
    console.warn(
      "[seed] Admin : ADMIN_SEED_EMAIL est défini mais ADMIN_SEED_PASSWORD est vide ou absent — le hash ne sera pas mis à jour."
    );
  } else if (!adminEmail && adminPassword) {
    console.warn(
      "[seed] Admin : ADMIN_SEED_PASSWORD est défini mais pas ADMIN_SEED_EMAIL."
    );
  } else if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        prenom: "Admin",
        nom: "ArabeSimplement",
        passwordHash,
        role: "ADMIN",
      },
      update: {
        passwordHash,
        role: "ADMIN",
      },
    });
    const check = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { passwordHash: true },
    });
    if (!check?.passwordHash) {
      console.error(
        "[seed] Échec : password_hash toujours vide après upsert — vérifiez prisma generate et la colonne en base."
      );
    } else {
      console.log("[seed] Compte admin OK :", adminEmail, "(password_hash renseigné)");
    }
  }

  await prisma.siteConfig.upsert({
    where: { id: "global" },
    create: { id: "global", paypalMeRecipient: "YACINE_BOU18" },
    update: {},
  });
  console.log("[seed] site_config (PayPal.me) OK");
}

async function disconnectPrisma() {
  const { prisma } = await import("../src/lib/prisma");
  await prisma.$disconnect();
}

main()
  .then(async () => {
    await disconnectPrisma();
  })
  .catch(async (e) => {
    console.error(e);
    await disconnectPrisma().catch(() => {});
    process.exit(1);
  });
