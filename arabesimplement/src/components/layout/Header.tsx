"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/cours-darabe", label: "Cours d'arabe" },
  { href: "/boutique", label: "Boutique" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/notre-parcours", label: "Notre Parcours" },
  { href: "/contactez-nous", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <span className="font-arabic text-white text-lg font-bold">ع</span>
            </div>
            <span
              className={cn(
                "font-serif font-bold text-xl transition-colors duration-300",
                isScrolled ? "text-[#0F2A45]" : "text-[#0F2A45]"
              )}
            >
              ArabeSimplement
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-[#B7860B]",
                  isScrolled ? "text-[#0F2A45]" : "text-[#0F2A45]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/panier" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-[#B7860B]/10"
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5 text-[#0F2A45]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-[#B7860B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    data-testid="cart-count"
                  >
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account */}
            <Link href="/connexion" className="hidden sm:block">
              <Button
                variant="outline"
                className="border-[#0F2A45] text-[#0F2A45] hover:bg-[#0F2A45] hover:text-white"
                data-testid="account-button"
              >
                <User className="h-4 w-4 mr-2" />
                Mon compte
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
                <Menu className="h-6 w-6 text-[#0F2A45]" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                      <span className="font-arabic text-white text-lg font-bold">
                        ع
                      </span>
                    </div>
                    <span className="font-serif font-bold text-xl text-[#0F2A45]">
                      ArabeSimplement
                    </span>
                  </div>

                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#0F2A45] font-medium py-2 hover:text-[#B7860B] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-6 border-t mt-auto">
                    <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white">
                        <User className="h-4 w-4 mr-2" />
                        Mon compte
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
