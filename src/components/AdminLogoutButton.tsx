"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-300 hover:text-red-100 bg-red-950/60 hover:bg-red-900/80 rounded-lg border border-red-800/60 transition-colors cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" />
      Keluar
    </button>
  );
}
