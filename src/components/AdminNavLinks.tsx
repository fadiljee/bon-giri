"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Users, ExternalLink } from "lucide-react";

export default function AdminNavLinks({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Produk", href: "/admin/produk", icon: Package },
    { name: "Pengaturan Usaha", href: "/admin/pengaturan", icon: Settings },
  ];

  if (userRole === "ADMIN") {
    links.push({ name: "Kelola Staff", href: "/admin/users", icon: Users });
  }

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              isActive
                ? "bg-amber-400 text-amber-950 shadow-xs"
                : "text-neutral-300 hover:text-white hover:bg-neutral-700/60"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {link.name}
          </Link>
        );
      })}
      <Link
        href="/katalog"
        target="_blank"
        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white ml-auto"
      >
        Lihat Website Publik
        <ExternalLink className="w-3 h-3" />
      </Link>
    </>
  );
}
