import Link from "next/link";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  ArrowRight,
  Clock,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/StatCard";
import { PlacesGauge } from "@/components/admin/PlacesGauge";

// Mock data
const stats = {
  revenusThisMois: 2450,
  revenusPreviousMois: 1890,
  newStudents: 45,
  newStudentsPrevious: 32,
  formationsActives: 3,
  tauxConversion: 68,
};

const recentOrders = [
  {
    id: "ORD-001",
    user: "Ahmed B.",
    formation: "Lire en 10 leçons",
    amount: 8,
    date: "2026-01-12",
    status: "PAID",
  },
  {
    id: "ORD-002",
    user: "Fatima K.",
    formation: "Formation Tajwid",
    amount: 49,
    date: "2026-01-11",
    status: "PAID",
  },
  {
    id: "ORD-003",
    user: "Omar S.",
    formation: "Sessions Invocations",
    amount: 25,
    date: "2026-01-11",
    status: "PAID",
  },
  {
    id: "ORD-004",
    user: "Khadija L.",
    formation: "Lire en 10 leçons",
    amount: 8,
    date: "2026-01-10",
    status: "PAID",
  },
];

const creneaux = [
  { nom: "Session Matin - Lire l'arabe", current: 10, max: 12 },
  { nom: "Session Soir - Lire l'arabe", current: 8, max: 12 },
  { nom: "Tajwid Intensif", current: 6, max: 8 },
  { nom: "Invocations Weekend", current: 15, max: 20 },
];

const recentActivity = [
  { type: "inscription", text: "Ahmed B. s'est inscrit à Lire en 10 leçons", time: "Il y a 2h" },
  { type: "message", text: "Nouveau message de contact de Sara M.", time: "Il y a 3h" },
  { type: "paiement", text: "Paiement reçu de Fatima K. (49€)", time: "Il y a 5h" },
  { type: "creneau", text: "Omar S. a choisi le créneau Session Soir", time: "Il y a 6h" },
];

export default function AdminDashboardPage() {
  const revenusChange = ((stats.revenusThisMois - stats.revenusPreviousMois) / stats.revenusPreviousMois * 100).toFixed(0);
  const studentsChange = ((stats.newStudents - stats.newStudentsPrevious) / stats.newStudentsPrevious * 100).toFixed(0);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-1">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenus ce mois"
          value={`${stats.revenusThisMois}€`}
          change={`+${revenusChange}% vs mois dernier`}
          changeType="positive"
          icon={DollarSign}
          iconColor="text-[#1A7A4A]"
        />
        <StatCard
          title="Nouveaux étudiants"
          value={stats.newStudents}
          change={`+${studentsChange}% vs mois dernier`}
          changeType="positive"
          icon={Users}
          iconColor="text-[#1B6CA8]"
        />
        <StatCard
          title="Formations actives"
          value={stats.formationsActives}
          icon={BookOpen}
          iconColor="text-[#B7860B]"
        />
        <StatCard
          title="Taux de conversion"
          value={`${stats.tauxConversion}%`}
          change="Visiteurs → Acheteurs"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Dernières commandes
              </CardTitle>
              <Link href="/admin/paiements">
                <Button variant="ghost" size="sm" className="text-[#B7860B]">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#B7860B]/10 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-[#B7860B]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F2A45]">{order.user}</p>
                        <p className="text-sm text-gray-500">{order.formation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F2A45]">{order.amount}€</p>
                      <Badge className="bg-[#1A7A4A]/10 text-[#1A7A4A] text-xs">
                        Payé
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creneaux */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#B7860B]" />
                Créneaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {creneaux.map((creneau, index) => (
                <div key={index}>
                  <p className="text-sm text-[#0F2A45] mb-2">{creneau.nom}</p>
                  <PlacesGauge current={creneau.current} max={creneau.max} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#B7860B]" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#B7860B] mt-2" />
                  <div>
                    <p className="text-sm text-[#0F2A45]">{activity.text}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
