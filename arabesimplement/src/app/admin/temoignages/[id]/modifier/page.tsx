import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/data/testimonials.service";
import { TestimonialForm } from "../../TestimonialForm";

export default async function ModifierTemoignagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTestimonialById(id);
  if (!t) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-primary mb-6">
        Modifier le témoignage
      </h1>
      <TestimonialForm
        mode="edit"
        id={t.id}
        defaultValues={{
          nom: t.nom,
          texte: t.texte,
          note: t.note,
          approuve: t.approuve,
        }}
      />
    </div>
  );
}
