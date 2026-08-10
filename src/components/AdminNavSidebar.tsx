"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  ExternalLink,
  LogOut,
  Plus,
  Zap,
  MoreHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminNavSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Produk", href: "/admin/produk", icon: Package },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  if (userRole === "ADMIN") {
    mainNav.push({ name: "Kelola Staff", href: "/admin/users", icon: Users });
  }

  const getInitials = (name: string) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "BG";

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"));

  return (
    <Sidebar>
      {/* ── Brand ─────────────────────────────────────── */}
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full overflow-hidden bg-[#FDB813] flex shrink-0 items-center justify-center">
            <Image
              src="/images/logo.webp"
              alt="Bon Giri"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-[13px] font-semibold text-[#ededed] tracking-tight">
            Bon Giri
          </span>
        </div>
      </SidebarHeader>

      {/* ── Quick-Create CTA ──────────────────────────── */}
      <div className="px-2 pt-2 pb-1">
        <div className="flex items-center gap-1">
          <Link
            href="/admin/produk/tambah"
            className="flex flex-1 items-center gap-2 rounded-md bg-[#ededed] px-2.5 py-1.5 text-[12px] font-semibold text-[#111111] transition-colors hover:bg-white active:scale-[0.98]"
          >
            <Plus className="h-3 w-3 shrink-0" />
            Tambah Produk
          </Link>
          <button
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#525252] transition-colors hover:bg-[#1f1f1f] hover:text-[#737373]"
            title="Pintasan"
          >
            <Zap className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ── Main Nav ──────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  onClick={() => (window.location.href = item.href)}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* ── Documents-style section ───────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel>Pintasan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => window.open("/katalog", "_blank")}
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Website Publik</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontal className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Lebih Banyak</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User Footer ───────────────────────────────── */}
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="bg-[#FDB813] text-[#111111] text-[9px] font-bold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[11px] font-semibold text-[#ededed]">
              {userName}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#525252]">
              {userRole}
            </span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="shrink-0 text-[#525252] transition-colors hover:text-red-400"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
