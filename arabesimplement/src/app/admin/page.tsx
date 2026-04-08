import Link from "next/link";
import {
  DollarSign,
  Users,
  BookOpen,
  ShoppingCart,
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
import {
  getAdminStats,
  getAdminRecentOrders,
  getAdminCreneauOccupancy,
  getAdminRecentActivity,
} from "@/lib/data/admin.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import type { OrderStatus } from "@prisma/client";

function orderStatusLabel(s: OrderStatus): string {
  switch (s) {
    case "PAID":
      return "Payé";
    case "PENDING":
      return "En attente";
    case "FAILED":
      return "Échoué";
    case "REFUNDED":
      return "Remboursé";
    default:
      return s;
  }
}

function orderStatusClass(s: OrderStatus): string {
  if (s === "PAID") return "bg-accent/10 text-accent";
  if (s === "PENDING") return "bg-amber-100 text-amber-800";
  if (s === "FAILED") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-600";
}

export default async function AdminDashboardPage() {
  const db = isDatabaseConfigured();
  const [stats, recentOrders, creneaux, recentActivity] = db
    ? await Promise.all([
        getAdminStats(),
        getAdminRecentOrders(5),
        getAdminCreneauOccupancy(12),
        getAdminRecentActivity(8),
      ])
    : [
        {
          revenusThisMois: 0,
          revenusPreviousMois: 0,
          newStudents: 0,
          newStudentsPrevious: 0,
          formationsActives: 0,
          paidOrdersThisMois: 0,
        },
        [],
        [],
        [],
      ];

  const revenusChange =
    stats.revenusPreviousMois > 0
      ? (
          ((stats.revenusThisMois - stats.revenusPreviousMois) /
            stats.revenusPreviousMois) *
          100
        ).toFixed(0)
      : "0";
  const studentsChange =
    stats.newStudentsPrevious > 0
      ? (
          ((stats.newStudents - stats.newStudentsPrevious) /
            stats.newStudentsPrevious) *
          100
        ).toFixed(0)
      : "0";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-1">
          Vue d&apos;ensemble de votre activité
        </p>
        {!db && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            Aucune base de données configurée (DATABASE_URL). Les indicateurs
            restent à zéro.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Revenus ce mois"
          value={`${stats.revenusThisMois.toFixed(2)} €`}
          change={`${Number(revenusChange) >= 0 ? "+" : ""}${revenusChange}% vs mois dernier`}
          changeType={
            Number(revenusChange) >= 0 ? "positive" : "negative"
          }
          icon={DollarSign}
          iconColor="text-accent"
        />
        <StatCard
          title="Nouveaux étudiants"
          value={stats.newStudents}
          change={`${Number(studentsChange) >= 0 ? "+" : ""}${studentsChange}% vs mois dernier`}
          changeType={
            Number(studentsChange) >= 0 ? "positive" : "negative"
          }
          icon={Users}
          iconColor="text-primary-light"
        />
        <StatCard
          title="Formations actives"
          value={stats.formationsActives}
          icon={BookOpen}
          iconColor="text-secondary"
        />
        <StatCard
          title="Paiements réussis (mois)"
          value={stats.paidOrdersThisMois}
          change="Commandes marquées payées"
          changeType="neutral"
          icon={ShoppingCart}
          iconColor="text-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Dernières commandes
              </CardTitle>
              <Link href="/admin/paiements">
                <Button variant="ghost" size="sm" className="text-secondary">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  Aucune commande enregistrée pour le moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                          <CreditCard className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-primary truncate">
                            {order.userLabel}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.formationLabel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-primary">
                          {order.amount} €
                        </p>
                        <Badge
                          className={`text-xs ${orderStatusClass(order.status)}`}
                        >
                          {orderStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                Créneaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {creneaux.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun créneau. Ajoutez-en via le seed ou la base de données.
                </p>
              ) : (
                creneaux.map((creneau) => (
                  <div key={creneau.id}>
                    <p className="text-sm text-primary mb-2">
                      {creneau.label}
                    </p>
                    <PlacesGauge
                      current={Math.min(creneau.current, creneau.max)}
                      max={creneau.max}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune activité récente.</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-primary">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.timeLabel}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
