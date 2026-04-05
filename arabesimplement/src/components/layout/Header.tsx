"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import {
  HEADER_AIDE_LINKS,
  HeaderAideMenu,
} from "@/components/layout/HeaderAideMenu";

const mainNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/cours-darabe", label: "Cours d'arabe" },
  { href: "/boutique", label: "Boutique" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/notre-parcours", label: "Notre Parcours" },
  { href: "/contactez-nous", label: "Contact" },
] as const;

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export function Header({ isLoggedIn, isAdmin }: HeaderProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const accountHref = !isLoggedIn
    ? "/connexion"
    : isAdmin
      ? "/admin"
      : "/tableau-de-bord";

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
            <BrandLogoMark size={40} />
            <span className="font-serif font-bold text-xl transition-colors duration-300 text-primary">
              ArabeSimplement
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            aria-label="Navigation principale"
          >
            {mainNavLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 text-primary hover:text-secondary"
              >
                {link.label}
              </Link>
            ))}
            <HeaderAideMenu />
            {mainNavLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 text-primary hover:text-secondary"
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
                className="relative hover:bg-secondary/10"
                data-testid="cart-button"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    data-testid="cart-count"
                  >
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account */}
            <Link href={accountHref} className="hidden sm:block">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                data-testid="account-button"
              >
                <User className="h-4 w-4 mr-2" />
                {isLoggedIn ? "Tableau de bord" : "Mon compte"}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
                <Menu className="h-6 w-6 text-primary" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <BrandLogoMark size={40} />
                    <span className="font-serif font-bold text-xl text-primary">
                      ArabeSimplement
                    </span>
                  </div>

                  <nav className="flex flex-col gap-1" aria-label="Menu mobile">
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-primary font-medium py-2.5 hover:text-secondary transition-colors rounded-md px-1 -mx-1"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-3 mt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 px-1 mb-2">
                        Aide
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {HEADER_AIDE_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2.5 px-1 rounded-md text-primary hover:bg-surface transition-colors"
                          >
                            <span className="font-medium block">{link.label}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">
                              {link.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>

                  <div className="pt-6 border-t mt-auto space-y-2">
                    <Link href={accountHref} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {isLoggedIn ? "Tableau de bord" : "Mon compte"}
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
