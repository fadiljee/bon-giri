"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BusinessInfo, DEFAULT_BUSINESS_INFO } from "@/data/storefront";
import BagDrawer from "./BagDrawer";

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getThemeServerSnapshot(): "light" | "dark" {
  return "light";
}

interface SubpageShellProps {
  children: React.ReactNode;
  business?: BusinessInfo;
  externalBagOpen?: boolean;
  onExternalBagClose?: () => void;
}

export default function SubpageShell({
  children,
  business = DEFAULT_BUSINESS_INFO,
  externalBagOpen,
  onExternalBagClose,
}: SubpageShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, isInitialized } = useCart();
  const [internalBagOpen, setInternalBagOpen] = useState(false);

  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const isBagOpen = externalBagOpen !== undefined ? externalBagOpen : internalBagOpen;
  const closeBag = () => {
    if (onExternalBagClose) onExternalBagClose();
    setInternalBagOpen(false);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", next);
    try {
      localStorage.setItem("bongiri-theme", next);
    } catch {
      // ignore storage errors
    }
  };

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/katalog" },
    { label: "Riwayat Pesanan", href: "/pesanan" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="grain-overlay" aria-hidden="true" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
      >
        Lewati ke konten utama
      </a>

      <header id="site-header" className="site-header">
        <div className="sf-container h-full flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[44px] font-bold tracking-tight text-base"
            style={{ color: "var(--text-primary)" }}
          >
            <Image
              src="/images/logo-sm.png"
              alt="Logo Bon Giri"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span>Bon Giri</span>
          </Link>

          <nav aria-label="Navigasi utama" className="nav-links-desktop flex items-center gap-7">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="text-sm font-medium py-2 transition-colors hover:opacity-80"
                  style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
              aria-pressed={theme === "dark"}
              className="sf-icon-btn"
            >
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            <button
              id="bag-trigger"
              type="button"
              onClick={() => setInternalBagOpen(true)}
              aria-label={`Buka tas belanja, ${isInitialized ? totalItems : 0} item`}
              aria-expanded={isBagOpen}
              aria-controls="bag-drawer"
              className="relative inline-flex items-center gap-2 min-h-[44px] px-4 text-sm font-medium transition-colors"
              style={{
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Tas</span>
              <span
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-mono font-medium"
                style={{
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-text)",
                }}
              >
                {isInitialized ? totalItems : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 pt-24 pb-20">
        {children}
      </main>

      <footer className="py-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="sf-container flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>
              Bon Giri · Stik Keju Ikan Tenggiri
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              {business.address} · {business.openingHours}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className="sf-footer-pill"
            >
              <span>Etalase Utama</span>
            </Link>
            <Link
              href="/katalog"
              aria-current={pathname === "/katalog" || pathname.startsWith("/katalog/") ? "page" : undefined}
              className="sf-footer-pill"
            >
              <span>Katalog Lengkap</span>
            </Link>
            <Link
              href="/pesanan"
              aria-current={pathname === "/pesanan" ? "page" : undefined}
              className="sf-footer-pill"
            >
              <span>Riwayat Pesanan</span>
            </Link>
            <a
              href={`https://instagram.com/${business.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sf-footer-pill"
            >
              <span>@{business.instagramHandle}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <BagDrawer
        isOpen={isBagOpen}
        onClose={closeBag}
        waNumber={business.whatsappNumber}
        onExploreOrder={() => router.push("/#order")}
      />
    </div>
  );
}
