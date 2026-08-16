"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  LayoutGrid,
  Heart,
  ReceiptText,
  User,
  X,
  Home,
  Info,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { totalItems, isInitialized } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const bottomNavItems = [
    { name: "Katalog", href: "/", icon: LayoutGrid },
    { name: "Favorit", href: "/favorit", icon: Heart },
    { name: "Pesanan", href: "/pesanan", icon: ReceiptText },
    { name: "Profil", href: "/profil", icon: User },
  ];

  const drawerNavItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Katalog Rasa", href: "/katalog", icon: LayoutGrid },
    { name: "Keranjang Belanja", href: "/cart", icon: ShoppingBag, badge: totalItems },
    { name: "Riwayat Pesanan", href: "/pesanan", icon: ReceiptText },
    { name: "Varian Favorit", href: "/favorit", icon: Heart },
    { name: "Profil Saya", href: "/profil", icon: User },
    { name: "Tentang Bon Giri", href: "/tentang", icon: Info },
    { name: "Kontak & Lokasi", href: "/kontak", icon: PhoneCall },
  ];

  const isKatalogActive = pathname === "/" || pathname.startsWith("/katalog");

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-[#FFF9E6] relative shadow-[0_0_40px_rgba(0,0,0,0.05)] sm:border-x sm:border-[var(--color-muted)]/20 flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FFF9E6]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[var(--color-muted)]/10">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Buka Menu Navigasi"
          className="p-2 -ml-2 text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="font-display text-[26px] font-bold text-[var(--color-gold-dark)] tracking-tight">
          Bon Giri
        </Link>

        <Link href="/cart" className="p-2 -mr-2 text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors relative">
          <ShoppingBag className="w-6 h-6" />
          {isInitialized && totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[var(--color-error)] text-white text-[10px] font-bold rounded-full border-2 border-[#FFF9E6] flex items-center justify-center animate-in zoom-in-50 duration-150">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      </header>

      {/* SIDE NAVIGATION DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Sidebar */}
          <aside className="relative w-[280px] max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200 border-r border-[var(--color-muted)]/20">
            {/* Drawer Header */}
            <div className="p-5 bg-[#FFF9E6] border-b border-[var(--color-muted)]/15 flex items-center justify-between">
              <div>
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-display text-[22px] font-bold text-[var(--color-gold-dark)] block leading-tight"
                >
                  Bon Giri
                </Link>
                <span className="text-[11px] text-[var(--color-charcoal-soft)] font-medium block">
                  Stik Keju Ikan Tenggiri
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-[var(--color-charcoal-soft)] hover:text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              {drawerNavItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-[14px] text-[13px] font-bold transition-all ${
                      isActive
                        ? "bg-[var(--color-cream-soft)] text-[var(--color-gold-dark)] border border-[var(--color-gold)]/40 shadow-sm"
                        : "text-[var(--color-charcoal)] hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? "text-[var(--color-gold-dark)]" : "text-[var(--color-charcoal-soft)]"}`} />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-[var(--color-error)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)]/60" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[var(--color-cream-soft)]/50 border-t border-[var(--color-muted)]/15 text-center space-y-1">
              <span className="text-[11px] font-bold text-[var(--color-charcoal)] block">
                KLK Kewirausahaan UBB
              </span>
              <span className="text-[10px] text-[var(--color-muted)] block">
                Khas Kepulauan Bangka Belitung
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-6 w-full overflow-x-hidden">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-[var(--color-muted)]/20 px-2 py-2 flex items-center justify-between z-40 pb-safe">
        {bottomNavItems.map((item) => {
          let isActive = false;
          if (item.name === "Katalog") {
            isActive = isKatalogActive;
          } else {
            isActive = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
            >
              <div
                className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${
                  isActive ? "bg-[var(--color-gold)]/40" : "bg-transparent"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[var(--color-charcoal)] fill-transparent" : "text-[var(--color-charcoal-soft)]"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[11px] font-bold ${
                  isActive ? "text-[var(--color-gold-dark)]" : "text-[var(--color-charcoal-soft)]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
