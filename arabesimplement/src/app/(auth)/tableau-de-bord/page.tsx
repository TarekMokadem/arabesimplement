import Link from "next/link";
import { BookOpen, Calendar, Settings } from "lucide-react";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "../actions";
import { LogoutButton } from "./LogoutButton";
import { getEnrollmentsForLearner } from "@/lib/data/enrollments.service";
import {
  formatCreneauSlotLine,
  normalizeJourneeSlots,
  parseJourneeSlotsFromJson,
} from "@/lib/creneau-display";

function creneauContactHref(formationTitre: string): string {
  const sujet = encodeURIComponent(`Créneau — ${formationTitre}`);
  return `/contactez-nous?sujet=${sujet}`;
}

export default async function TableauDeBordPage() {
  const session = await getSession();
  const user = session
    ? { prenom: session.prenom, nom: session.nom, email: session.email }
    : { prenom: "Invité", nom: "", email: "" };

  const enrollments = session
    ? await getEnrollmentsForLearner(session.id)
    : [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <BrandLogoMark size={40} />
              <span className="font-serif font-bold text-xl">
                ArabeSimplement
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {user.prenom} {user.nom}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            Assalamou alaykoum, {user.prenom} !
          </h1>
          <p className="text-gray-600">
            Bienvenue dans votre espace apprenant.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formations */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Mes formations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="p-4 border rounded-lg hover:border-secondary/30 transition-colors"
                    data-testid={`enrollment-${enrollment.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-primary">
                          {enrollment.formation.titre}
                        </h3>
                        {enrollment.creneau ? (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>
                              {enrollment.creneau.nom} —{" "}
                              {normalizeJourneeSlots(
                                parseJourneeSlotsFromJson(
                                  enrollment.creneau.journeeSlots
                                ),
                                {
                                  jours: enrollment.creneau.jours,
                                  heureDebut: enrollment.creneau.heureDebut,
                                  dureeMinutes: enrollment.creneau.dureeMinutes,
                                }
                              )
                                .map(formatCreneauSlotLine)
                                .join(" · ")}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <Link href={creneauContactHref(enrollment.formation.titre)}>
                              <Button
                                size="sm"
                                className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                              >
                                Choisir mon créneau
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                      <Badge
                        className={
                          enrollment.tokenUsed
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary/10 text-secondary"
                        }
                      >
                        {enrollment.tokenUsed
                          ? "Inscrit"
                          : enrollment.creneau
                            ? "Créneau choisi"
                            : "En attente"}
                      </Badge>
                    </div>
                  </div>
                ))}

                {enrollments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Vous n&apos;avez pas encore de formation. Les achats
                      validés apparaissent ici après paiement.
                    </p>
                    <Link href="/boutique">
                      <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                        Découvrir nos formations
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" />
                  Mes informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Nom complet</span>
                  <p className="font-medium text-primary">
                    {user.prenom} {user.nom}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium text-primary">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 border-primary text-primary"
                  disabled
                >
                  Modifier mes informations
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Liens utiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/boutique"
                  className="block p-3 rounded-lg hover:bg-surface transition-colors text-primary"
                >
                  Voir les formations
                </Link>
                <Link
                  href="/contactez-nous"
                  className="block p-3 rounded-lg hover:bg-surface transition-colors text-primary"
                >
                  Nous contacter
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
