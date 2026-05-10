import { ContactezNousView } from "./ContactezNousView";

function pickFirst(
  value: string | string[] | undefined
): string {
  if (value == null) return "";
  return typeof value === "string" ? value : value[0] ?? "";
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactezNousPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialSujet = pickFirst(sp.sujet).trim();

  return <ContactezNousView initialSujet={initialSujet} />;
}
