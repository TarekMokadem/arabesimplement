import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { getSession } from "@/app/(auth)/actions";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <>
      <Header isLoggedIn={!!session} isAdmin={session?.role === "ADMIN"} />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
