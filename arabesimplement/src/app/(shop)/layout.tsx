import Link from "next/link";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Minimal header for checkout */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <BrandLogoMark size={44} priority />
              <span className="font-serif font-bold text-lg text-primary">
                ArabeSimplement
              </span>
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
