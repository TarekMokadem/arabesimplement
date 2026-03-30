import type { OrderFormInput } from "@/lib/validations/order.schema";

export type OrderBillingSnapshot = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  pays: string;
};

export function orderFormToBillingSnapshot(
  data: OrderFormInput
): OrderBillingSnapshot {
  return {
    prenom: data.prenom.trim(),
    nom: data.nom.trim(),
    email: data.email.trim().toLowerCase(),
    telephone: data.telephone.trim(),
    pays: data.pays.trim(),
  };
}

export function parseBillingSnapshot(
  raw: unknown
): OrderBillingSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const prenom = typeof o.prenom === "string" ? o.prenom.trim() : "";
  const nom = typeof o.nom === "string" ? o.nom.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const telephone =
    typeof o.telephone === "string" ? o.telephone.trim() : "";
  const pays = typeof o.pays === "string" ? o.pays.trim() : "";
  if (!prenom || !nom || !email || !telephone || !pays) return null;
  return { prenom, nom, email, telephone, pays };
}
