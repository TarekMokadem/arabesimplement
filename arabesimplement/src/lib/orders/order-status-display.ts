import type { OrderStatus } from "@prisma/client";

export function orderStatusLabel(s: OrderStatus): string {
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

export function orderStatusBadgeClass(s: OrderStatus): string {
  switch (s) {
    case "PAID":
      return "bg-accent/10 text-accent";
    case "PENDING":
      return "bg-amber-100 text-amber-900";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
