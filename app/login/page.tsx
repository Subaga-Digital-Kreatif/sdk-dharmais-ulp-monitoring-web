"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, LineChart, Lock, Mail, ShieldCheck } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AUTH_USER_STORAGE_KEY, auth, type AuthUser } from "@/models/auth";
import { apiToken } from "@/models/api";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function persistSession(remember: boolean) {
  try {
    if (remember) {
      localStorage.setItem("ulp_auth_demo", "1");
    } else {
      sessionStorage.setItem("ulp_auth_demo", "1");
    }
  } catch {
    // ignore storage errors
  }
}

function persistAuthUser(user: AuthUser, remember: boolean) {
  try {
    const payload = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, payload);
      sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_USER_STORAGE_KEY, payload);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    mode: "onChange",
  });

  const { register, control, handleSubmit, setError, formState } = form;
  const { errors, isSubmitting, isValid } = formState;

  async function onSubmit(values: LoginFormValues) {
    try {
      const data = await auth.login(values.email, values.password);
      if (data.token) {
        apiToken.set(data.token);
      }
      persistAuthUser(data.user, values.remember);
      persistSession(values.remember);
      router.push("/");
    } catch (err) {
      let message = "Login gagal. Periksa email dan password Anda.";
      if (isAxiosError(err)) {
        const d = err.response?.data;
        if (typeof d === "string" && d.trim()) {
          message = d;
        } else if (d && typeof d === "object" && "message" in d) {
          const m = (d as { message?: unknown }).message;
          if (typeof m === "string" && m.trim()) message = m;
        } else if (err.message) {
          message = err.message;
        }
      }
      setError("root", { message });
    }
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
                Halaman login terhubung ke API autentikasi. Pastikan{" "}
                <code className="rounded bg-[#E6F3FF] px-1">NEXT_PUBLIC_API_URL</code>{" "}
                sudah dikonfigurasi.
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
              Akses
            </div>
            <p className="text-[#5B6B7F]">
              Gunakan kredensial yang diberikan administrator sistem untuk lingkungan ini.
            </p>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col justify-center lg:mt-0 lg:w-[420px]">
          <Card className="rounded-3xl">
            <CardHeader className="border-[#E1ECF7]">
              <CardTitle>Login</CardTitle>
              <CardDescription>Masukkan kredensial Anda untuk melanjutkan.</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          className="h-10 border-[#C9E3FF] bg-white pl-9 focus-visible:ring-[#0066CC]"
                          placeholder="admin@subagakreatif.com"
                          aria-invalid={!!errors.email}
                          {...register("email")}
                        />
                      </div>
                      <FieldError errors={[errors.email]} />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="h-10 border-[#C9E3FF] bg-white pl-9 pr-10 focus-visible:ring-[#0066CC]"
                          placeholder="••••••••"
                          aria-invalid={!!errors.password}
                          {...register("password")}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-[#5B6B7F] hover:bg-[#E6F3FF] hover:text-[#0066CC]"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FieldError errors={[errors.password]} />
                    </FieldContent>
                  </Field>
                </FieldGroup>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Controller
                      name="remember"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Ingat sesi"
                        />
                      )}
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

                {errors.root ? (
                  <div
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                    role="alert"
                  >
                    {errors.root.message}
                  </div>
                ) : null}

                <Button type="submit" className="h-10 gap-2" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Masuk"}
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
