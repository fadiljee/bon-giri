import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import AdminNavLinks from "@/components/AdminNavLinks";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { User } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-[#1A1A1A] text-white border-b border-neutral-800 sticky top-0 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[#FDB813] p-0.5 shadow-sm flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Bon Giri Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain rounded-md"
                />
              </div>
              <span className="font-extrabold tracking-tight text-white text-lg">
                BON GIRI <span className="text-[#FDB813] text-xs font-semibold">Admin Panel</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {session?.user && (
              <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                <User className="w-3.5 h-3.5 text-[#FDB813]" />
                <span className="font-bold text-white">{session.user.name}</span>
                <span className="bg-[#FDB813]/20 text-[#FDD273] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {(session.user as any).role || "STAFF"}
                </span>
              </div>
            )}

            <AdminLogoutButton />
          </div>
        </div>

        {/* Admin Nav Sub-bar */}
        <div className="bg-neutral-800 border-t border-neutral-700/60 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center gap-1 overflow-x-auto py-1">
            <AdminNavLinks userRole={(session?.user as any)?.role || "STAFF"} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
