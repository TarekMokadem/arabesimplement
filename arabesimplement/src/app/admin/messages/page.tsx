import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContactMessagesForAdmin } from "@/lib/data/contact.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { ContactMessageActions } from "./ContactMessageActions";

export default async function MessagesPage() {
  const db = isDatabaseConfigured();
  const messages = db ? await getContactMessagesForAdmin() : [];
  const unread = messages.filter((m) => !m.lu).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">
          Messages
        </h1>
        <p className="text-gray-500 mt-1">
          Formulaire contact — {unread} non lu{unread > 1 ? "s" : ""}
        </p>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Sans DATABASE_URL, les messages ne sont pas enregistrés côté serveur.
        </p>
      )}
      {messages.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {db ? "Aucun message pour le moment." : "—"}
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card
              key={m.id}
              className={`bg-white ${!m.lu ? "border-l-4 border-l-secondary" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary text-sm">
                          {m.nom
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-primary">{m.nom}</p>
                        <p className="text-sm text-gray-500">{m.email}</p>
                      </div>
                      {!m.lu && (
                        <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-primary mb-2">
                      {m.sujet}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{m.message}</p>
                    <p className="text-sm text-gray-400 mt-3">
                      {m.createdAt.toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <ContactMessageActions
                    messageId={m.id}
                    lu={m.lu}
                    replyMailto={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.sujet)}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
