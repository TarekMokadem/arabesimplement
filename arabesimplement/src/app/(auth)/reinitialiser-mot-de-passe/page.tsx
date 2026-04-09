import { ResetPasswordForm } from "./ResetPasswordForm";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  return <ResetPasswordForm token={token} />;
}
