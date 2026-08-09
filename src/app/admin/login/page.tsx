"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowLeft, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password yang Anda masukkan salah.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#1A1A1A]">
      {/* ── LEFT PANEL (Brand) ── */}
      <div className="hidden md:flex md:w-1/2 lg:w-[52%] flex-col justify-between bg-[#1A1A1A] relative overflow-hidden p-10 lg:p-14">
        {/* Background decorative pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #FDB813 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gold gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FDB813 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #005B96 0%, transparent 70%)" }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="h-11 w-11 rounded-xl bg-[#FDB813] p-0.5 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Bon Giri"
                width={40}
                height={40}
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-extrabold tracking-tight text-white leading-none" style={{ fontFamily: "var(--font-montserrat)" }}>
                BON GIRI
              </span>
              <span className="text-[11px] font-semibold text-[#FDD273] tracking-wide leading-tight">
                Stik Keju Ikan Tenggiri
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Hero text */}
        <div className="relative z-10 space-y-6 my-auto py-10">
          <div className="inline-flex items-center gap-2 bg-[#FDB813]/20 border border-[#FDB813]/30 rounded-full px-3.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FDB813] animate-pulse" />
            <span className="text-[11px] font-bold text-[#FDD273] uppercase tracking-widest">
              Portal Internal Bisnis
            </span>
          </div>
          <h1
            className="text-4xl lg:text-5xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Kelola Bisnis{" "}
            <span className="text-[#FDB813] italic">Bon Giri</span>{" "}
            <br />dengan Mudah
          </h1>
          <p className="text-[15px] text-[#A6A6A6] leading-relaxed max-w-md" style={{ fontFamily: "var(--font-montserrat)" }}>
            Pantau produk, kelola inventaris, dan optimalkan penjualan camilan khas Bangka Belitung Anda dari satu panel terpadu.
          </p>

          {/* Feature badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md">
            {[
              "Manajemen Produk",
              "Pengaturan Bisnis",
              "Multi-Role User",
              "Dashboard Realtime",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FDB813] shrink-0" />
                <span className="text-[13px] font-medium text-[#E0E0E0]">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#FDB813] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>

      {/* ── RIGHT PANEL (Login Form) ── */}
      <div className="flex flex-1 flex-col justify-center bg-[#F8F7F4] px-6 py-12 sm:px-10 md:px-12 lg:px-16 xl:px-20 min-h-screen">
        {/* Mobile back link */}
        <div className="mb-8 md:hidden">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Halaman Utama
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="mb-8 md:hidden flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-[#FDB813] p-1 shadow-lg flex items-center justify-center">
              <Image src="/images/logo.png" alt="Bon Giri" width={56} height={56} className="h-full w-full object-contain rounded-xl" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-montserrat)" }}>BON GIRI</h2>
              <p className="text-xs text-[#6B6B6B]">Portal Internal Bisnis</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-[28px] sm:text-3xl font-bold text-[#1A1A1A] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Selamat Datang <span className="text-[#FDB813]">Kembali</span>
            </h2>
            <p className="mt-2 text-[14px] text-[#6B6B6B]" style={{ fontFamily: "var(--font-montserrat)" }}>
              Masuk ke panel admin untuk mengelola bisnis Anda.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bongiri.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E0E0E0] rounded-xl text-[14px] text-[#1A1A1A] placeholder-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#FDB813] focus:border-transparent transition-all shadow-sm"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A6A6A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-[#E0E0E0] rounded-xl text-[14px] text-[#1A1A1A] placeholder-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#FDB813] focus:border-transparent transition-all shadow-sm"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A6A6A6] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white bg-[#1A1A1A] hover:bg-[#333333] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Panel Admin"
              )}
            </button>
          </form>

          {/* Divider + credentials hint */}
          <div className="mt-8 pt-6 border-t border-[#E0E0E0]">
            <p className="text-center text-[12px] font-semibold text-[#A6A6A6] uppercase tracking-wider mb-3">
              Akun Default
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-[12px]">
                <span className="font-semibold text-[#6B6B6B]">Admin</span>
                <span className="font-mono text-[#1A1A1A] font-bold">adminbongiri123</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-[12px]">
                <span className="font-semibold text-[#6B6B6B]">Staff</span>
                <span className="font-mono text-[#1A1A1A] font-bold">staffbongiri123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
