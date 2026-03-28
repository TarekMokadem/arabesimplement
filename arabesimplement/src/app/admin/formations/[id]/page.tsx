import { notFound } from "next/navigation";
import { getFormationAdminDetail } from "@/lib/data/admin-formations.service";
import { FormationEditorForm } from "../FormationEditorForm";
import { formationVersFormInput } from "../formation-vers-form";
import { CreneauManager, type CreneauListeItem } from "../CreneauManager";

export default async function ModifierFormationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const f = await getFormationAdminDetail(id);
  if (!f) notFound();

  const creneaux: CreneauListeItem[] = f.creneaux.map((c) => ({
    id: c.id,
    nom: c.nom,
    jours: c.jours,
    heureDebut: c.heureDebut,
    dureeMinutes: c.dureeMinutes,
    placesMax: c.placesMax,
    whatsappLink: c.whatsappLink,
    statut: c.statut,
  }));

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-12">
      <FormationEditorForm
        mode="edit"
        formationId={f.id}
        slugAvant={f.slug}
        defaultValues={formationVersFormInput(f)}
      />
      <hr className="border-gray-200" />
      <CreneauManager
        formationId={f.id}
        creneaux={creneaux}
        schedulingMode={f.schedulingMode}
      />
    </div>
  );
}
