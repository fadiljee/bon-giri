"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <Button
            key={link.href}
            asChild
            variant={isActive ? "brand" : "ghost"}
            size="sm"
            className={isActive ? "font-bold text-[#1A1A1A]" : "text-neutral-300 hover:text-white hover:bg-neutral-800"}
          >
            <Link href={link.href}>
              <Icon className="w-3.5 h-3.5 mr-1" />
              {link.name}
            </Link>
          </Button>
        );
      })}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-neutral-400 hover:text-white ml-auto text-xs"
      >
        <Link href="/katalog" target="_blank">
          Lihat Website Publik
          <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </Button>
    </>
  );
}
