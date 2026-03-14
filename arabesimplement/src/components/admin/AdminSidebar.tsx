"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  FileText,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/formations", label: "Formations", icon: BookOpen },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/temoignages", label: "Témoignages", icon: Star },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B7860B] to-[#D4AF37] rounded-lg flex items-center justify-center">
            <span className="font-arabic text-white text-lg font-bold">ع</span>
          </div>
          <div>
            <span className="font-serif font-bold text-white block">Admin</span>
            <span className="text-xs text-gray-400">ArabeSimplement</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || 
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#B7860B] text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-1">
        <Link href="/" target="_blank">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700"
          >
            Retour au site
          </Button>
        </Link>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0F2A45] flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F2A45] border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B7860B] to-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="font-arabic text-white text-sm font-bold">ع</span>
            </div>
            <span className="font-serif font-bold text-white">Admin</span>
          </Link>

          <Sheet>
            <SheetTrigger className="p-2 text-white">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-[#0F2A45] border-r-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
