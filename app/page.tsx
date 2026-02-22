"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  LineChart,
  Play,
  Pause,
  ShieldCheck,
  Users,
  CalendarRange,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OverviewView } from "./dashboard/overview-view";
import { PolisView } from "./dashboard/polis-view";
import { PremiView } from "./dashboard/premi-view";
import { KlaimView } from "./dashboard/klaim-view";

type DashboardView = "overview" | "polis" | "premi" | "klaim";

type PeriodPreset = "today" | "7d" | "30d" | "custom";

type PeriodState = {
  preset: PeriodPreset;
  from: string;
  to: string;
};

const orderedViews: DashboardView[] = ["overview", "polis", "premi", "klaim"];

export default function Home() {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodState>(() => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    return { preset: "today", from: iso, to: iso };
  });
  const isDesktop = useIsDesktop();

  useAutoRotate({
    enabled: autoRotate && isDesktop,
    activeView,
    onChange: setActiveView,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

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

  const viewLabel = useMemo(() => {
    if (activeView === "overview") return "Ringkasan Portofolio";
    if (activeView === "polis") return "Monitoring Polis Aktif";
    if (activeView === "premi") return "Monitoring Premi Asuransi";
    return "Monitoring Klaim Asuransi";
  }, [activeView]);

  const handleSetPreset = (preset: PeriodPreset) => {
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);

    if (preset === "today") {
      setPeriod({ preset, from: todayIso, to: todayIso });
      return;
    }

    if (preset === "7d" || preset === "30d") {
      const offset = preset === "7d" ? 6 : 29;
      const fromDate = new Date(today);
      fromDate.setDate(fromDate.getDate() - offset);
      const fromIso = fromDate.toISOString().slice(0, 10);
      setPeriod({ preset, from: fromIso, to: todayIso });
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
              SIP H2H
            </p>
            <p className="text-sm font-semibold">
              Dashboard Monitoring Kredit Konsumtif
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-xs text-[#5B6B7F] sm:flex">
          <Badge variant="soft" className="gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Portofolio Tercover Asuransi
          </Badge>
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>Realtime Monitoring</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 lg:px-6 lg:pb-5 lg:pt-4 lg:overflow-hidden">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as DashboardView)}
          className="flex h-full flex-col"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#5B6B7F]">
                <span>Monitoring</span>
                <span className="h-4 w-px bg-[#C9D7E8]" />
                <span className="font-medium text-[#0B1E33]">
                  Kredit Konsumtif Tercover Asuransi
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                  {viewLabel}
                </h1>
                <Badge className="gap-1 rounded-full bg-[#0066CC] px-2 py-0.5 text-[11px]">
                  <Users className="h-3 w-3" />
                  Retail & Payroll Segment
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="polis">Polis</TabsTrigger>
                <TabsTrigger value="premi">Premi</TabsTrigger>
                <TabsTrigger value="klaim">Klaim</TabsTrigger>
              </TabsList>
              <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-[#C9E3FF] bg-white px-3 py-1.5 text-xs sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[#5B6B7F]">Periode</span>
                  <span className="h-3 w-px bg-[#E1ECF7]" />
                  <div className="flex gap-1 overflow-x-auto whitespace-nowrap pr-1">
                    <button
                      type="button"
                      className={`rounded-full px-2 py-0.5 ${
                        period.preset === "today"
                          ? "bg-[#0066CC] text-white"
                          : "text-[#0B1E33]"
                      }`}
                      onClick={() => handleSetPreset("today")}
                    >
                      Hari Ini
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
              <div className="flex items-center gap-2 rounded-full border border-[#C9E3FF] bg-white px-3 py-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoRotate}
                    onCheckedChange={(checked) =>
                      setAutoRotate(Boolean(checked))
                    }
                    aria-label="Auto rotate view"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-[#0B1E33]">
                      Auto rotate
                    </span>
                    <span className="text-[11px] text-[#5B6B7F]">
                      Ganti tampilan otomatis
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#E6F3FF] text-[#0066CC]">
                  {autoRotate ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <TabsContent
            value="overview"
            className="flex-1 overflow-y-auto lg:overflow-hidden"
          >
            <OverviewView isLoading={isLoading} />
          </TabsContent>
          <TabsContent
            value="polis"
            className="flex-1 overflow-y-auto lg:overflow-hidden"
          >
            <PolisView isLoading={isLoading} />
          </TabsContent>
          <TabsContent
            value="premi"
            className="flex-1 overflow-y-auto lg:overflow-hidden"
          >
            <PremiView isLoading={isLoading} />
          </TabsContent>
          <TabsContent
            value="klaim"
            className="flex-1 overflow-y-auto lg:overflow-hidden"
          >
            <KlaimView isLoading={isLoading} />
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
    }, 15000);
    return () => clearInterval(interval);
  }, [enabled, activeView, onChange]);
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        setIsDesktop(window.innerWidth >= 1280);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isDesktop;
}
