import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const messages = [
  { id: "1", nom: "Sara M.", email: "sara@email.com", sujet: "Question créneaux", message: "Bonjour, puis-je changer de créneau ?", lu: false, date: "2026-01-12" },
  { id: "2", nom: "Mohamed A.", email: "mohamed@email.com", sujet: "Information Tajwid", message: "Plus d'infos sur la formation Tajwid svp", lu: false, date: "2026-01-12" },
  { id: "3", nom: "Amina B.", email: "amina@email.com", sujet: "Remerciements", message: "Barakallahu fik pour cette formation !", lu: true, date: "2026-01-11" },
];

export default function MessagesPage() {
  const unread = messages.filter(m => !m.lu).length;
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">Messages</h1>
        <p className="text-gray-500 mt-1">{unread} non lu{unread > 1 ? "s" : ""}</p>
      </div>
      <div className="space-y-4">
        {messages.map((m) => (
          <Card key={m.id} className={`bg-white ${!m.lu ? "border-l-4 border-l-[#B7860B]" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#0F2A45]/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-[#0F2A45] text-sm">{m.nom.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#0F2A45]">{m.nom}</p>
                      <p className="text-sm text-gray-500">{m.email}</p>
                    </div>
                    {!m.lu && <Badge className="bg-[#B7860B] text-white">Nouveau</Badge>}
                  </div>
                  <h3 className="font-semibold text-[#0F2A45] mb-2">{m.sujet}</h3>
                  <p className="text-gray-600">{m.message}</p>
                  <p className="text-sm text-gray-400 mt-3">{new Date(m.date).toLocaleDateString("fr-FR")}</p>
                </div>
                <Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2" />Répondre</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
