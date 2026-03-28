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
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center">
                <span className="font-serif text-secondary-foreground text-sm font-bold">ع</span>
              </div>
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
