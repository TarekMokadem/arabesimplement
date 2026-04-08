import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminFormationsList } from "@/lib/data/admin.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import type { FormationStatus } from "@prisma/client";

function statutLabel(s: FormationStatus): string {
  switch (s) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "COMING_SOON":
      return "Bientôt";
    case "ARCHIVED":
      return "Archivée";
    default:
      return s;
  }
}

function statutBadgeClass(s: FormationStatus): string {
  if (s === "ACTIVE") return "bg-accent/10 text-accent";
  if (s === "COMING_SOON") return "bg-amber-100 text-amber-900";
  return "bg-gray-100 text-gray-600";
}

export default async function FormationsPage() {
  const db = isDatabaseConfigured();
  const formations = db ? await getAdminFormationsList() : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Formations
          </h1>
          <p className="text-gray-500 mt-1">Gérez vos formations (données BDD)</p>
        </div>
        {db ? (
          <Link
            href="/admin/formations/nouvelle"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Link>
        ) : (
          <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        )}
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour afficher les formations.
        </p>
      )}
      {formations.length === 0 && db ? (
        <p className="text-gray-500 text-sm">Aucune formation en base.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f) => (
            <Card key={f.id} className="bg-white overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                {f.imageUrl ? (
                  <Image
                    src={f.imageUrl}
                    alt={f.titre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-14 w-14 text-gray-300" />
                  </div>
                )}
                <Badge
                  className={`absolute top-3 right-3 ${statutBadgeClass(f.statut)}`}
                >
                  {statutLabel(f.statut)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif font-bold text-primary mb-2">
                  {f.titre}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">
                    {f.prixPromo ?? f.prix} €
                  </span>
                  <span className="text-sm text-gray-500">
                    {f.inscrits} inscrits
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/admin/formations/${f.id}`}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "flex-1 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Gérer
                  </Link>
                  <Link
                    href={`/boutique/${f.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "flex-1"
                    )}
                  >
                    Voir boutique
                  </Link>
                  <Link
                    href={`/boutique/${f.slug}`}
                    aria-label="Aperçu"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon-sm" })
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
