"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdminUserManagement({ initialUsers }: { initialUsers: UserItem[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [newUser, ...prev]);
        setSuccess(`Akun ${name} berhasil ditambahkan!`);
        setName(""); setEmail(""); setPassword("");
        setShowAddForm(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Gagal membuat akun staff.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#ededed]">Manajemen Staff</h1>
          <p className="mt-0.5 text-[12px] text-[#525252]">
            Kelola akun internal yang memiliki akses ke Admin Panel Bon Giri.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="default"
          size="sm"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          {showAddForm ? "Tutup Form" : "Tambah Akun"}
        </Button>
      </div>

      {/* Success */}
      {success && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-semibold">{success}</AlertDescription>
        </Alert>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6">
          <p className="text-[13px] font-semibold text-[#ededed] mb-4">Akun Staff Baru</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="staff-name">Nama Lengkap *</Label>
                <Input id="staff-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Budi Pratama" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-email">Email Akses *</Label>
                <Input id="staff-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="budi@bongiri.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="staff-password">Password *</Label>
                <Input id="staff-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-role">Role *</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="staff-role">
                    <SelectValue placeholder="Pilih role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">STAFF — CRUD produk</SelectItem>
                    <SelectItem value="ADMIN">ADMIN — Akses penuh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? "Memproses..." : "Buat Akun"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Staff</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#525252] shrink-0" />
                    <span className="font-semibold text-[#ededed]">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[12px] text-[#737373]">{u.email}</span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide border ${
                    u.role === "ADMIN"
                      ? "bg-[#FDB813]/10 text-[#FDB813] border-[#FDB813]/20"
                      : "bg-[#1f1f1f] text-[#737373] border-[#2a2a2a]"
                  }`}>
                    {u.role}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
