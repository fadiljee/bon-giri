"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs"
    >
      <LogOut className="w-3.5 h-3.5 mr-1" />
      Keluar
    </Button>
  );
}
