"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, LayoutGrid, Heart, ReceiptText, User } from "lucide-react";

export default function MobileAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cartCount] = useState(0); // Mock cart count

  const bottomNavItems = [
    { name: "Katalog", href: "/", icon: LayoutGrid },
    { name: "Favorit", href: "/favorit", icon: Heart },
    { name: "Pesanan", href: "/pesanan", icon: ReceiptText },
    { name: "Profil", href: "/profil", icon: User },
  ];

  // We map the root "/" to "Katalog" in the mockup for the bottom nav
  // But also /katalog. Let's treat "/" and "/katalog" as Katalog tab.
  const isKatalogActive = pathname === "/" || pathname.startsWith("/katalog");

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-[#FFF9E6] relative shadow-[0_0_40px_rgba(0,0,0,0.05)] sm:border-x sm:border-[var(--color-muted)]/20 flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#FFF9E6]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button aria-label="Menu" className="p-2 -ml-2 text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <Link href="/" className="font-display text-[26px] font-bold text-[var(--color-gold-dark)] tracking-tight">
          Bon Giri
        </Link>
        
        <Link href="/cart" className="p-2 -mr-2 text-[var(--color-charcoal)] hover:bg-black/5 rounded-full transition-colors relative">
          <ShoppingBag className="w-6 h-6" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--color-error)] rounded-full border-2 border-[#FFF9E6]"></span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-6 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-[var(--color-muted)]/20 px-2 py-2 flex items-center justify-between z-50 pb-safe">
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
