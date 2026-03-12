import { Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const utilisateurs = [
  { id: "1", prenom: "Ahmed", nom: "Benali", email: "ahmed@email.com", formations: 2, createdAt: "2026-01-05" },
  { id: "2", prenom: "Fatima", nom: "Kaddouri", email: "fatima@email.com", formations: 1, createdAt: "2026-01-08" },
  { id: "3", prenom: "Omar", nom: "Said", email: "omar@email.com", formations: 3, createdAt: "2026-01-10" },
  { id: "4", prenom: "Khadija", nom: "Lahlou", email: "khadija@email.com", formations: 1, createdAt: "2026-01-11" },
];

export default function UtilisateursPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">{utilisateurs.length} étudiants inscrits</p>
        </div>
        <Button variant="outline">Exporter CSV</Button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Rechercher..." className="pl-10 max-w-md" />
      </div>
      <Card className="bg-white">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Formations</th>
                <th className="text-left p-4 font-medium text-gray-600">Inscrit le</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#B7860B]/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-[#B7860B]">{u.prenom[0]}{u.nom[0]}</span>
                      </div>
                      <span className="font-medium text-[#0F2A45]">{u.prenom} {u.nom}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4"><Badge className="bg-[#0F2A45]/10 text-[#0F2A45]">{u.formations}</Badge></td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
