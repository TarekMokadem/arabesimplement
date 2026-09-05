import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerLoader } from "@/components/shop/CartDrawerLoader";
import { getSession } from "@/app/(auth)/actions";
import { DiscoveryLessonPopupLoader } from "@/components/home/DiscoveryLessonPopupLoader";
import { calendlyDiscoveryUrl } from "@/lib/calendly";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <link rel="preconnect" href="https://calendly.com" />
      <link rel="preconnect" href="https://assets.calendly.com" />
      <link rel="dns-prefetch" href="https://calendly.com" />
      <Header isLoggedIn={!!session} isAdmin={session?.role === "ADMIN"} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawerLoader />
      <DiscoveryLessonPopupLoader calendlyUrl={calendlyDiscoveryUrl()} />
    </>
  );
}
