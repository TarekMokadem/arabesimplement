import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerLoader } from "@/components/shop/CartDrawerLoader";
import { getSession } from "@/app/(auth)/actions";
import { DiscoveryLessonPopup } from "@/components/home/DiscoveryLessonPopup";
import { calendlyDiscoveryUrl } from "@/lib/calendly";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <Header isLoggedIn={!!session} isAdmin={session?.role === "ADMIN"} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawerLoader />
      <DiscoveryLessonPopup calendlyUrl={calendlyDiscoveryUrl()} />
    </>
  );
}
