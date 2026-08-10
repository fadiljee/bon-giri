"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Menu, X, ShieldCheck, Phone, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { InstagramIcon } from "./InstagramIcon";

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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/60 shadow-xs transition-all duration-200">
      {/* Top Utility Bar */}
      <div className="hidden lg:block border-b border-neutral-200/40 bg-neutral-50/90 text-[11px] font-medium text-neutral-500 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-[#005B96]" />
              Pangkalpinang, Bangka Belitung
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-600">Binaan KLK Kewirausahaan UBB</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:6288267018426"
              className="flex items-center gap-1 hover:text-[#005B96] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#005B96]" />
              <span className="font-bold text-[#1A1A1A]">HUBUNGI US:</span> 0882-6701-8426
            </a>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/stikkeju.bongiri_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#005B96] transition-colors p-0.5"
                title="Instagram @stikkeju.bongiri_"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/6288267018426"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#005B96] transition-colors p-0.5"
                title="WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#FDB813] p-0.5 shadow-xs transition-transform group-hover:scale-105 flex items-center justify-center">
            <Image
              src="/images/logo.webp"
              alt="Bon Giri Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[19px] font-extrabold tracking-tight text-[#1A1A1A] leading-none">
                BON GIRI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FDB813]" />
            </div>
            <span className="text-[11px] font-semibold text-[#005B96] tracking-wide leading-tight mt-0.5">
              Stik Keju Tulang Ikan Tenggiri
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-neutral-100 text-[#005B96] font-bold"
                    : "text-neutral-700 hover:text-[#005B96] hover:bg-neutral-100/70"
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
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1A1A1A] bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#005B96]" />
              Panel Admin
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-neutral-700 hover:text-[#1A1A1A] border border-neutral-200 bg-white px-3.5 py-2 rounded-lg hover:bg-neutral-50 transition-all shadow-2xs"
            >
              Login Staff
            </Link>
          )}

          <a
            href="https://wa.me/6288267018426?text=Halo%20Bon%20Giri%2C%20saya%20ingin%20tanya%20produk%20stik%20keju"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn text-xs py-2 px-4 shadow-xs hover:shadow"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            Order WA
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#1A1A1A] hover:text-[#005B96] rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-base font-semibold rounded-lg ${
                  isActive
                    ? "bg-[#FDB813]/20 text-[#1A1A1A] font-bold"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2 mt-2">
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
                className="w-full text-center py-2.5 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-center"
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
