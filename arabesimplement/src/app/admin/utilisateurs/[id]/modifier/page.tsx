import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserForAdminById } from "@/lib/data/admin.service";
import { UserEditForm } from "../../UserEditForm";

export default async function ModifierUtilisateurPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserForAdminById(id);
  if (!user) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {user.role === "STUDENT" ? (
        <p className="mb-4">
          <Link
            href={`/admin/utilisateurs/${user.id}`}
            className="text-sm font-medium text-secondary hover:text-primary underline underline-offset-2"
          >
            Fiche élève — cours et groupe WhatsApp
          </Link>
        </p>
      ) : null}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Modifier l&apos;utilisateur
      </h1>
      <UserEditForm
        userId={user.id}
        defaultValues={{
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          telephone: user.telephone ?? "",
          role: user.role,
        }}
        commandesCount={user._count.orders}
        inscriptionsCount={user._count.enrollments}
      />
    </div>
  );
}
