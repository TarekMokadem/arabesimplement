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
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-3xl font-bold text-primary mb-8">
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
