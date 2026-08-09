"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Menu, X, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Produk", href: "/katalog" },
    { name: "Tentang Bon Giri", href: "/tentang" },
    { name: "Kontak Usaha", href: "/kontak" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1A1A1A] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo with /images/logo.png */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#FDB813] p-0.5 shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Bon Giri Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold tracking-tight text-white leading-none">
              BON GIRI
            </span>
            <span className="text-[11px] font-semibold text-[#FDD273] tracking-wide leading-tight">
              Stik Keju Ikan Tenggiri
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${isActive
                    ? "bg-white/15 text-white font-bold"
                    : "text-[#E0E0E0] hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Panel Admin
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-[#A6A6A6] hover:text-white transition-colors px-2 py-1"
            >
              Login Staff
            </Link>
          )}

          <a
            href="https://wa.me/6288267018426?text=Halo%20Bon%20Giri%2C%20saya%20ingin%20tanya%20produk%20stik%20keju"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn text-xs py-2 px-4"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            Order WA
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-[#FDB813] rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1A1A1A] px-4 py-4 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-base font-semibold rounded-lg ${isActive
                    ? "bg-[#FDB813] text-[#1A1A1A] font-bold"
                    : "text-[#E0E0E0] hover:bg-white/10 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 mt-2">
            <a
              href="https://wa.me/6288267018426?text=Halo%20Bon%20Giri%2C%20saya%20ingin%20tanya%20produk"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn w-full text-sm text-center py-2.5 justify-center"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              Pesan via WhatsApp
            </a>
            {session ? (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold text-[#1A1A1A] bg-[#FDB813] rounded-lg hover:bg-[#FDD273] transition-colors"
              >
                Panel Admin
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-[#A6A6A6] hover:text-white"
              >
                Login Staff / Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
