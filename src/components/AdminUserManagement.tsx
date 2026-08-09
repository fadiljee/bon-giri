"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, User, Mail, Lock } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdminUserManagement({
  initialUsers,
}: {
  initialUsers: UserItem[];
}) {
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
        setSuccess(`Akun staff ${name} berhasil ditambahkan!`);
        setName("");
        setEmail("");
        setPassword("");
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Pengguna Staff</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola akun internal yang memiliki akses login ke Admin Panel Bon Giri.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-xs font-bold px-4 py-2.5 shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          {showAddForm ? "Tutup Form" : "Tambah Akun Staff Baru"}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          {success}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs max-w-xl space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">
            Form Akun Staff Baru
          </h3>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Budi Pratama"
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Email Pengguna *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@bongiri.com"
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Password Akses *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Role Akses *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              >
                <option value="STAFF">STAFF (CRUD produk, tanpa hapus permanen)</option>
                <option value="ADMIN">ADMIN (Akses penuh termasuk hapus & user)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs font-bold px-5 py-2"
              >
                {loading ? "Memproses..." : "Buat Akun"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6">Nama Staff</th>
                <th className="py-4 px-6">Email Akses</th>
                <th className="py-4 px-6">Role Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-neutral-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    {u.name}
                  </td>
                  <td className="py-4 px-6">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === "ADMIN"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-sky-100 text-sky-900 border border-sky-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
