"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowLeft, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-neutral-900">
      {/* ── LEFT PANEL (Brand Showcase) ── */}
      <div className="hidden md:flex md:w-1/2 lg:w-[52%] flex-col justify-between bg-neutral-950 relative overflow-hidden p-10 lg:p-14 border-r border-neutral-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #FDB813 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="h-11 w-11 rounded-xl bg-[#FDB813] p-0.5 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.webp"
                alt="Bon Giri"
                width={40}
                height={40}
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-extrabold tracking-tight text-white leading-none">
                BON GIRI
              </span>
              <span className="text-[11px] font-semibold text-[#FDD273] tracking-wide leading-tight mt-0.5">
                Stik Keju Ikan Tenggiri
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Hero text */}
        <div className="relative z-10 space-y-6 my-auto py-10">
          <Badge variant="warning" className="gap-1.5 py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6300] animate-pulse" />
            Portal Internal Bisnis
          </Badge>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
            Kelola Bisnis <br />
            <span className="text-[#FDB813]">Bon Giri</span> dengan Mudah
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Pantau produk, kelola inventaris, dan optimalkan penjualan camilan khas Bangka Belitung Anda dari satu panel terpadu.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md">
            {[
              "Manajemen Produk",
              "Pengaturan Bisnis",
              "Multi-Role User",
              "Dashboard Realtime",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FDB813] shrink-0" />
                <span className="text-xs font-medium text-neutral-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <Button variant="link" asChild className="text-neutral-400 hover:text-[#FDB813] text-xs">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Kembali ke Halaman Utama
            </Link>
          </Button>
        </div>
      </div>

      {/* ── RIGHT PANEL (Login Form Card) ── */}
      <div className="flex flex-1 flex-col justify-center bg-neutral-50 px-6 py-12 sm:px-10 md:px-12 lg:px-16 min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="md:hidden">
            <Button variant="ghost" size="sm" asChild className="text-neutral-600 mb-4">
              <Link href="/">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Kembali
              </Link>
            </Button>
          </div>

          <Card className="shadow-lg border-neutral-200">
            <CardHeader className="space-y-1.5 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="brand" className="text-[10px]">AUTH PORTAL</Badge>
              </div>
              <CardTitle className="text-2xl font-extrabold text-neutral-900">
                Selamat Datang <span className="text-[#005B96]">Kembali</span>
              </CardTitle>
              <CardDescription>
                Masuk ke panel admin untuk mengelola produk dan bisnis Anda.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@bongiri.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 font-bold py-2.5"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memverifikasi...
                    </>
                  ) : (
                    "Masuk ke Panel Admin"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
