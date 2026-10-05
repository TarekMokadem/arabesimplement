import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { normalizeWhatsappHref } from "@/lib/utils/whatsapp-link";
import { getDiscoveryLeadById } from "@/lib/data/discovery-leads.service";
import { DiscoveryLeadNotesForm } from "@/app/admin/cours-decouverte/DiscoveryLeadNotesForm";
import { DiscoveryLeadDetailActions } from "@/app/admin/cours-decouverte/DiscoveryLeadDetailActions";

export const dynamic = "force-dynamic";

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-primary font-medium break-words">{children}</dd>
    </div>
  );
}

export default async function AdminDiscoveryLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isDatabaseConfigured()) notFound();

  const lead = await getDiscoveryLeadById(id);
  if (!lead) notFound();

  const whatsappHref = normalizeWhatsappHref(lead.whatsapp);
  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(`Cours découverte — ${lead.fullName}`)}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <Link
        href="/admin/cours-decouverte"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-4 -ml-2 text-gray-600"
        )}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Toutes les demandes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {lead.fullName}
          </h1>
          <p className="text-gray-500 mt-1">
            Demande du {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lead.traite ? (
            <Badge className="bg-gray-100 text-gray-700">Traité</Badge>
          ) : (
            <Badge className="bg-secondary text-secondary-foreground">
              À traiter
            </Badge>
          )}
          {lead.calendlyEventUri ? (
            <Badge className="bg-emerald-100 text-emerald-800">
              Créneau réservé
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800">Sans créneau</Badge>
          )}
          <DiscoveryLeadDetailActions
            leadId={lead.id}
            fullName={lead.fullName}
            traite={lead.traite}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={mailto}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Mail className="h-4 w-4 mr-2" />
          E-mail
        </a>
        {whatsappHref.startsWith("http") ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </a>
        ) : null}
        {lead.calendlyEventUri ? (
          <a
            href={lead.calendlyEventUri}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Voir le créneau Calendly
          </a>
        ) : null}
      </div>

      <div className="grid gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Coordonnées</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid sm:grid-cols-2 gap-4">
              <DetailField label="Prénom">{lead.prenom}</DetailField>
              <DetailField label="Nom">{lead.nom}</DetailField>
              <DetailField label="E-mail">
                <a
                  href={mailto}
                  className="text-secondary hover:underline break-all"
                >
                  {lead.email}
                </a>
              </DetailField>
              <DetailField label="WhatsApp">{lead.whatsapp}</DetailField>
              <DetailField label="Pays">{lead.pays}</DetailField>
              <DetailField label="Niveau">{lead.niveauLabel}</DetailField>
            </dl>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Créneau</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <DetailField label="Calendly">
                {lead.calendlyEventUri ? (
                  <a
                    href={lead.calendlyEventUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline break-all"
                  >
                    {lead.calendlyEventUri}
                  </a>
                ) : (
                  "Pas encore choisi"
                )}
              </DetailField>
              <DetailField label="Dernière mise à jour">
                {formatDateTime(lead.updatedAt)}
              </DetailField>
            </dl>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <DiscoveryLeadNotesForm
              leadId={lead.id}
              initialNotes={lead.notes ?? ""}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
