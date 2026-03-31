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
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-16">
            <a href="/" className="flex items-center gap-3">
              <BrandLogoMark size={32} />
              <span className="font-serif font-bold text-lg text-primary">
                ArabeSimplement
              </span>
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
