"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  LineChart,
  Play,
  Pause,
  ShieldCheck,
  CalendarRange,
  LayoutDashboard,
  Package,
  Activity,
  Database,
  FileText,
  LogOut,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OverviewView } from "./dashboard/overview-view";
import { AnggaranView } from "./dashboard/anggaran-view";
import { PersiapanDashboardView } from "./persiapan-dashboard/persiapan-dashboard-view";
import { ProsesDashboardView } from "./proses-dashboard/proses-dashboard-view";
import { loadUlpData, UlpData } from "./dashboard/data-loader";
import { AUTH_USER_STORAGE_KEY } from "@/models/auth";
import { apiToken } from "@/models/api";

type DashboardView =
  | "overview"
  | "persiapan"
  | "proses"
  | "laporan";

type PeriodPreset = "all" | "today" | "7d" | "30d" | "custom";

type PeriodState = {
  preset: PeriodPreset;
  from: string;
  to: string;
};

const orderedViews: DashboardView[] = [
  "overview",
  "persiapan",
  "proses",
  "laporan",
];

export default function Home() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [autoRotate, setAutoRotate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ulpData, setUlpData] = useState<UlpData[]>([]);
  const [period, setPeriod] = useState<PeriodState>(() => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    return { preset: "all", from: iso, to: iso };
  });

  /** Jangan baca storage di render: SSR tidak punya window → placeholder; klien bisa langsung authed → mismatch. */
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const ok =
        localStorage.getItem("ulp_auth_demo") === "1" ||
        sessionStorage.getItem("ulp_auth_demo") === "1";
      setIsAuthed(ok);
    } catch {
      setIsAuthed(false);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady || isAuthed) return;
    router.replace("/login");
  }, [authReady, isAuthed, router]);

  useAutoRotate({
    enabled: autoRotate,
    activeView,
    onChange: setActiveView,
  });

  useEffect(() => {
    if (!authReady || !isAuthed) return;
    const timeout = setTimeout(() => setIsLoading(false), 800);
    loadUlpData().then((data) => {
      setUlpData(data);

      // Default period spans full data range so the dashboard shows data
      // out of the box even when CSV is older than today.
      const times = data
        .map((d) => (d.tanggalDpp ?? d.tanggalDiterimaDpp)?.getTime() ?? 0)
        .filter((t) => t > 0);
      if (times.length > 0) {
        const fmt = (d: Date) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        };
        setPeriod({
          preset: "all",
          from: fmt(new Date(Math.min(...times))),
          to: fmt(new Date(Math.max(...times))),
        });
      }
    });
    return () => clearTimeout(timeout);
  }, [authReady, isAuthed]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    try {
      apiToken.delete();
      localStorage.removeItem("ulp_auth_demo");
      sessionStorage.removeItem("ulp_auth_demo");
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {
    }
    router.push("/login");
  };

  const dataRange = useMemo(() => {
    if (!ulpData.length) return null;
    const times = ulpData
      .map((d) => (d.tanggalDpp ?? d.tanggalDiterimaDpp)?.getTime() ?? 0)
      .filter((t) => t > 0);
    if (times.length === 0) return null;
    return { min: new Date(Math.min(...times)), max: new Date(Math.max(...times)) };
  }, [ulpData]);

  const filteredData = useMemo(() => {
    if (!ulpData.length) return [];

    const { from, to } = period;
    const [fromY, fromM, fromD] = from.split("-").map(Number);
    const [toY, toM, toD] = to.split("-").map(Number);

    // Create dates at start/end of day in local time
    const fromDate = new Date(fromY, fromM - 1, fromD, 0, 0, 0, 0);
    const toDate = new Date(toY, toM - 1, toD, 23, 59, 59, 999);

    return ulpData.filter((item) => {
      // Primary date: Tanggal DPP, Fallback: Tanggal Diterima DPP
      const date = item.tanggalDpp || item.tanggalDiterimaDpp;
      if (!date) return false;

      return date >= fromDate && date <= toDate;
    });
  }, [ulpData, period]);

  if (!authReady || !isAuthed) {
    return <div className="min-h-screen bg-[#F7FBFF]" />;
  }

  const formatIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleSetPreset = (preset: PeriodPreset) => {
    // Anchor presets to latest data date, not wall-clock today, so presets
    // return data even when CSV is older than the current date.
    const ref = dataRange?.max ?? new Date();
    const refIso = formatIso(ref);

    if (preset === "all") {
      const fromIso = dataRange ? formatIso(dataRange.min) : refIso;
      setPeriod({ preset, from: fromIso, to: refIso });
      return;
    }

    if (preset === "today") {
      setPeriod({ preset, from: refIso, to: refIso });
      return;
    }

    if (preset === "7d" || preset === "30d") {
      const offset = preset === "7d" ? 6 : 29;
      const fromDate = new Date(ref);
      fromDate.setDate(fromDate.getDate() - offset);
      setPeriod({ preset, from: formatIso(fromDate), to: refIso });
      return;
    }
  };

  const handleCustomFromChange = (value: string) => {
    if (!value) return;
    setPeriod((prev) => {
      const nextFrom = value;
      const nextTo = prev.to < nextFrom ? nextFrom : prev.to;
      return { preset: "custom", from: nextFrom, to: nextTo };
    });
  };

  const handleCustomToChange = (value: string) => {
    if (!value) return;
    setPeriod((prev) => {
      const nextTo = value;
      const nextFrom = prev.from > nextTo ? nextTo : prev.from;
      return { preset: "custom", from: nextFrom, to: nextTo };
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FBFF] text-[#0B1E33]">
      <header className="flex items-center justify-between border-b border-[#E1ECF7] bg-white px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0066CC] text-white">
            <LineChart className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#5B6B7F]">
              RS KANKER DHARMAIS
            </p>
            <p className="text-sm font-semibold">
              Dashboard Monitoring ULP
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-xs text-[#5B6B7F] sm:flex">
          <Badge variant="soft" className="gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Pengadaan Barang & Jasa
          </Badge>
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>Realtime Monitoring</span>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 gap-2">
            <Link href="/master-data">
              <Database className="h-4 w-4" />
              Master Data
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 lg:px-6 lg:pb-5 lg:pt-4 lg:overflow-hidden">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as DashboardView)}
          className="flex h-full flex-col"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#5B6B7F]">
                <span>Monitoring</span>
                <span className="h-4 w-px bg-[#C9D7E8]" />
                <span className="font-medium text-[#0B1E33]">
                  Unit Layanan Pengadaan
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                  {viewLabel}
                </h1>
                <Badge className="gap-1 rounded-full bg-[#0066CC] px-2 py-0.5 text-[11px]">
                  <Users className="h-3 w-3" />
                  Semua Unit Kerja
                </Badge>
              </div>
            </div> */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <TabsList>
                <TabsTrigger value="overview" className="gap-2">
                   <LayoutDashboard className="h-4 w-4" />
                   <span className="hidden lg:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="persiapan" className="gap-2">
                   <Package className="h-4 w-4" />
                   <span className="hidden lg:inline">Persiapan Pemilihan</span>
                </TabsTrigger>
                <TabsTrigger value="proses" className="gap-2">
                   <Activity className="h-4 w-4" />
                   <span className="hidden lg:inline">Proses Pemilihan</span>
                </TabsTrigger>
                <TabsTrigger value="laporan" className="gap-2">
                   <FileText className="h-4 w-4" />
                   <span className="hidden lg:inline">Laporan Capaian</span>
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-[#C9E3FF] bg-white px-3 py-1.5 text-xs sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[#5B6B7F]">Periode</span>
                  <span className="h-3 w-px bg-[#E1ECF7]" />
                  <div className="flex gap-1 overflow-x-auto whitespace-nowrap pr-1">
                    <button
                      type="button"
                      className={`rounded-full px-2 py-0.5 ${
                        period.preset === "all"
                          ? "bg-[#0066CC] text-white"
                          : "text-[#0B1E33]"
                      }`}
                      onClick={() => handleSetPreset("all")}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-2 py-0.5 ${
                        period.preset === "today"
                          ? "bg-[#0066CC] text-white"
                          : "text-[#0B1E33]"
                      }`}
                      onClick={() => handleSetPreset("today")}
                      title="Hari terakhir data"
                    >
                      Terakhir
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-2 py-0.5 ${
                        period.preset === "7d"
                          ? "bg-[#0066CC] text-white"
                          : "text-[#0B1E33]"
                      }`}
                      onClick={() => handleSetPreset("7d")}
                    >
                      7 Hari
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-2 py-0.5 ${
                        period.preset === "30d"
                          ? "bg-[#0066CC] text-white"
                          : "text-[#0B1E33]"
                      }`}
                      onClick={() => handleSetPreset("30d")}
                    >
                      30 Hari
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#F7FBFF] px-2 py-0.5">
                  <CalendarRange className="h-3 w-3 text-[#0066CC]" />
                  <input
                    type="date"
                    value={period.from}
                    onChange={(e) => handleCustomFromChange(e.target.value)}
                    className="h-6 flex-1 rounded border border-[#C9E3FF] bg-white px-1 text-[11px] text-[#0B1E33]"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={period.to}
                    onChange={(e) => handleCustomToChange(e.target.value)}
                    className="h-6 flex-1 rounded border border-[#C9E3FF] bg-white px-1 text-[11px] text-[#0B1E33]"
                  />
                </div>
              </div>
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  autoRotate
                    ? "border-[#0066CC] bg-[#E6F3FF]"
                    : "border-[#C9E3FF] bg-white"
                }`}
              >
                <div className="relative h-10 w-10 shrink-0">
                  {autoRotate && (
                    <svg
                      key={activeView}
                      className="absolute inset-0 -rotate-90"
                      viewBox="0 0 40 40"
                      aria-hidden
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="none"
                        stroke="#0066CC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="113"
                        className="autorotate-ring"
                      />
                    </svg>
                  )}
                  <button
                    type="button"
                    aria-label={
                      autoRotate
                        ? "Jeda putar otomatis"
                        : "Mulai putar otomatis"
                    }
                    aria-pressed={autoRotate}
                    onClick={() => setAutoRotate((v) => !v)}
                    className={`absolute inset-[3px] flex items-center justify-center rounded-full border transition-colors ${
                      autoRotate
                        ? "border-[#0066CC] bg-[#0066CC] text-white shadow-sm"
                        : "border-[#C9E3FF] bg-[#E6F3FF] text-[#0066CC] hover:bg-[#d9ecfc]"
                    }`}
                  >
                    {autoRotate ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                  </button>
                  {autoRotate && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span
                    className={`font-medium ${
                      autoRotate ? "text-[#0066CC]" : "text-[#0B1E33]"
                    }`}
                  >
                    {autoRotate ? "Putar otomatis • LIVE" : "Putar otomatis"}
                  </span>
                  <span className="text-[11px] text-[#5B6B7F]">
                    {autoRotate
                      ? "Ganti tab tiap 15 detik"
                      : "Tekan play untuk mulai"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <TabsContent
            value="overview"
            className="flex-1 overflow-hidden"
          >
            <OverviewView isLoading={isLoading} data={filteredData} />
          </TabsContent>
          <TabsContent
            value="persiapan"
            className="flex-1 overflow-hidden"
          >
            <PersiapanDashboardView embedded startDate={period.from} endDate={period.to} />
          </TabsContent>
          <TabsContent
            value="proses"
            className="flex-1 overflow-hidden"
          >
            <ProsesDashboardView embedded startDate={period.from} endDate={period.to} />
          </TabsContent>
          <TabsContent
            value="laporan"
            className="flex-1 overflow-hidden"
          >
            <AnggaranView isLoading={isLoading} data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type UseAutoRotateArgs = {
  enabled: boolean;
  activeView: DashboardView;
  onChange: (view: DashboardView) => void;
};

function useAutoRotate({ enabled, activeView, onChange }: UseAutoRotateArgs) {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const currentIndex = orderedViews.indexOf(activeView);
      const nextIndex = (currentIndex + 1) % orderedViews.length;
      onChange(orderedViews[nextIndex]);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [enabled, activeView, onChange]);
}

