import Link from "next/link";
import Image from "next/image";
import { MessageSquare, MapPin, Clock, Heart } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#A6A6A6] pt-12 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-white/10">

          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#FDB813] p-0.5 shadow-sm flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Bon Giri Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain rounded-md"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block leading-none">
                  BON GIRI
                </span>
                <span className="text-[11px] font-semibold text-[#FDD273] tracking-wide">
                  Stik Keju Ikan Tenggiri
                </span>
              </div>
            </div>

            <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-md">
              Camilan lezat gurih renyah stik keju asli berbahan dasar tepung kalsium tulang ikan tenggiri khas Bangka Belitung. Usaha mikro binaan KLK Kewirausahaan Universitas Bangka Belitung.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/stikkeju.bongiri_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-[#E0E0E0] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                @stikkeju.bongiri_
              </a>
              <a
                href="https://wa.me/6288267018426"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60 text-xs font-semibold border border-emerald-800/40 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Order
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.08em] mb-5">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { name: "Beranda", href: "/" },
                { name: "Katalog Produk", href: "/katalog" },
                { name: "Tentang Usaha", href: "/tentang" },
                { name: "Kontak & Lokasi", href: "/kontak" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#FDB813] transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin/login" className="hover:text-[#FDB813] transition-colors text-[#6B6B6B]">
                  Portal Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Informasi */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.08em] mb-5">
              Informasi Usaha
            </h3>
            <ul className="space-y-3.5 text-sm text-[#6B6B6B]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FDB813] shrink-0 mt-0.5" />
                <span>Pangkalpinang, Kepulauan Bangka Belitung</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FDB813] shrink-0 mt-0.5" />
                <span>Senin – Sabtu: 08.00 – 17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="text-center text-[11px] text-[#6B6B6B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Bon Giri Stik Keju. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 fill-[#C81E1E] text-[#C81E1E]" /> oleh Tim KLK Kewirausahaan UBB
          </p>
        </div>
      </div>
    </footer>
  );
}
