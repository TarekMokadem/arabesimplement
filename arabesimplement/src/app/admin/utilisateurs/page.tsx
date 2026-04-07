import Link from "next/link";
import { Search, Mail, Pencil, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getAdminUserList } from "@/lib/data/admin.service";
import { isDatabaseConfigured } from "@/lib/utils/database";

export default async function UtilisateursPage() {
  const db = isDatabaseConfigured();
  const utilisateurs = db ? await getAdminUserList() : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">
            Utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            {utilisateurs.length} compte(s) — données issues de la base
          </p>
        </div>
        <Button variant="outline" disabled>
          Exporter CSV
        </Button>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour afficher les utilisateurs.
        </p>
      )}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Recherche (bientôt)..." className="pl-10 max-w-md" disabled />
      </div>
      <Card className="bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Rôle</th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Formations
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Inscrit le
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    {db ? "Aucun utilisateur en base." : "Données non disponibles."}
                  </td>
                </tr>
              ) : (
                utilisateurs.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-secondary">
                            {u.prenom[0]}
                            {u.nom[0]}
                          </span>
                        </div>
                        <Link
                          href={`/admin/utilisateurs/${u.id}`}
                          className="font-medium text-primary hover:text-secondary hover:underline"
                        >
                          {u.prenom} {u.nom}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-[200px] truncate" title={u.email}>
                      {u.email}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          u.role === "ADMIN"
                            ? "bg-secondary/20 text-amber-900"
                            : "bg-primary/10 text-primary"
                        }
                      >
                        {u.role === "ADMIN" ? "Admin" : "Étudiant"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-primary/10 text-primary">
                        {u.formationsCount}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {u.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/utilisateurs/${u.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" })
                          )}
                          aria-label={`Fiche ${u.prenom}`}
                        >
                          <UserCircle className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/utilisateurs/${u.id}/modifier`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" })
                          )}
                          aria-label={`Modifier ${u.prenom}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <a
                          href={`mailto:${u.email}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-primary"
                          aria-label={`Écrire à ${u.email}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
