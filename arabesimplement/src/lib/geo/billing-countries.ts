/** Pays nommés proposés au checkout et au cours découverte. */
export const NAMED_BILLING_COUNTRIES = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Maroc",
  "Algérie",
  "Tunisie",
  "Égypte",
  "Émirats arabes unis",
  "Arabie saoudite",
] as const;

/** Pays du checkout (liste fermée + « Autre » pour la facturation). */
export const BILLING_COUNTRIES = [...NAMED_BILLING_COUNTRIES, "Autre"] as const;

/** Pays du formulaire d’appel découverte : choix nommé obligatoire, sans « Autre ». */
export const DISCOVERY_COUNTRIES = NAMED_BILLING_COUNTRIES;

export type BillingCountry = (typeof BILLING_COUNTRIES)[number];
export type DiscoveryCountry = (typeof DISCOVERY_COUNTRIES)[number];

export function isBillingCountry(value: string): value is BillingCountry {
  return billingCountriesInclude(value);
}

export function billingCountriesInclude(value: string): boolean {
  return (BILLING_COUNTRIES as readonly string[]).includes(value);
}

export function discoveryCountriesInclude(value: string): boolean {
  return (DISCOVERY_COUNTRIES as readonly string[]).includes(value);
}
