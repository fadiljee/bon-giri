import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNavSidebar from "@/components/AdminNavSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LogOut, ExternalLink, Settings } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const userName = session.user.name || "User";
  const userRole = (session.user as any)?.role || "STAFF";

  const getInitials = (name: string) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "BG";

  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider defaultOpen={true}>
        {/* App Shell */}
        <div className="flex min-h-screen w-full bg-[#0f0f0f]">

          {/* ── Sidebar ────────────────────────────────── */}
          <AdminNavSidebar userName={userName} userRole={userRole} />

          {/* ── Content Area ───────────────────────────── */}
          <div className="flex flex-1 flex-col min-w-0">

            {/* ── Top Header ─────────────────────────── */}
            <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-[#1f1f1f] bg-[#111111]/95 px-4 backdrop-blur-md">

              {/* Left: toggle + page title */}
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="h-4 w-px bg-[#2a2a2a]" />
                <span className="text-[13px] font-medium text-[#a3a3a3]">
                  Dashboard
                </span>
              </div>

              {/* Right: avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-7 w-7 ring-1 ring-[#2a2a2a] hover:ring-[#3a3a3a] transition-all">
                    <AvatarFallback className="bg-[#FDB813] text-[#111111] text-[10px] font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <div className="px-2.5 py-1.5">
                    <p className="text-xs font-semibold text-[#ededed]">{userName}</p>
                    <p className="text-[10px] text-[#525252] truncate">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/pengaturan" className="flex items-center gap-2">
                      <Settings className="h-3.5 w-3.5" />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/katalog" target="_blank" className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Website Publik
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/api/auth/signout"
                      className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Keluar
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            {/* ── Page Content ───────────────────────── */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
