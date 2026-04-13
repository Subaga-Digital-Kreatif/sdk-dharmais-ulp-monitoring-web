"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LineChart,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type LoginStatus = "idle" | "submitting";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ok =
        localStorage.getItem("ulp_auth_demo") === "1" ||
        sessionStorage.getItem("ulp_auth_demo") === "1";
      if (ok) router.replace("/");
    } catch {
    }
  }, [router]);

  const canSubmit = useMemo(() => {
    return status !== "submitting" && username.trim().length > 0 && password.length > 0;
  }, [password.length, status, username]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    if (!u || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 550));

    const ok = u.toLowerCase() === "admin" && password === "admin";
    if (!ok) {
      setStatus("idle");
      setError("Login gagal. Gunakan akun demo: admin / admin.");
      return;
    }

    try {
      if (remember) {
        localStorage.setItem("ulp_auth_demo", "1");
      } else {
        sessionStorage.setItem("ulp_auth_demo", "1");
      }
    } catch {
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#0B1E33]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 lg:flex-row lg:items-stretch lg:gap-10 lg:px-6 lg:py-10">
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#E1ECF7] bg-white p-6 shadow-sm lg:p-10">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#0066CC]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0066CC] text-white">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-[#5B6B7F]">
                  RS Kanker Dharmais
                </div>
                <div className="text-base font-semibold">Dashboard Monitoring ULP</div>
              </div>
            </div>

            <div className="mt-8 max-w-lg">
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Masuk untuk mengelola dan memantau pengadaan
              </h1>
              <p className="mt-2 text-sm text-[#5B6B7F]">
                Halaman login ini menggunakan autentikasi demo. Integrasi autentikasi
                sebenarnya bisa ditambahkan kemudian tanpa mengubah layout.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="soft" className="gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Akses berbasis peran
              </Badge>
              <Badge variant="soft">Audit-friendly</Badge>
              <Badge variant="soft">Single dashboard shell</Badge>
            </div>
          </div>

          <div className="relative mt-10 grid gap-3 rounded-2xl border border-[#E1ECF7] bg-[#F7FBFF] p-4 text-sm lg:mt-0">
            <div className="text-xs font-medium uppercase tracking-wide text-[#5B6B7F]">
              Demo Credential
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span className="text-[#5B6B7F]">Username</span>
              <span className="font-semibold">admin</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span className="text-[#5B6B7F]">Password</span>
              <span className="font-semibold">admin</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col justify-center lg:mt-0 lg:w-[420px]">
          <Card className="rounded-3xl">
            <CardHeader className="border-[#E1ECF7]">
              <CardTitle>Login</CardTitle>
              <CardDescription>Masukkan kredensial Anda untuk melanjutkan.</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-[#5B6B7F]" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                    <Input
                      id="username"
                      autoComplete="username"
                      className="h-10 border-[#C9E3FF] bg-white pl-9 focus-visible:ring-[#0066CC]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-medium text-[#5B6B7F]" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="h-10 border-[#C9E3FF] bg-white pl-9 pr-10 focus-visible:ring-[#0066CC]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-[#5B6B7F] hover:bg-[#E6F3FF] hover:text-[#0066CC]"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={remember}
                      onCheckedChange={(v) => setRemember(Boolean(v))}
                      aria-label="Remember session"
                    />
                    <div className="leading-tight">
                      <div className="text-xs font-medium">Remember</div>
                      <div className="text-[11px] text-[#5B6B7F]">Simpan sesi login</div>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="text-xs font-medium text-[#0066CC] hover:text-[#0052A3]"
                  >
                    Kembali ke dashboard
                  </Link>
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" className="h-10 gap-2" disabled={!canSubmit}>
                  {status === "submitting" ? "Memproses..." : "Masuk"}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="text-center text-[11px] text-[#5B6B7F]">
                  Dengan login, Anda menyetujui kebijakan penggunaan internal.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
