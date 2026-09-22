/** Pays proposés au checkout et au cours découverte (liste fermée + « Autre »). */
export const BILLING_COUNTRIES = [
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
  "Autre",
] as const;

export type BillingCountry = (typeof BILLING_COUNTRIES)[number];

export function isBillingCountry(value: string): value is BillingCountry {
  return billingCountriesInclude(value);
}

export function billingCountriesInclude(value: string): boolean {
  return (BILLING_COUNTRIES as readonly string[]).includes(value);
}
