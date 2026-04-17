"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePager } from "@/components/ui/table-pager";
import { DashboardFilterBar } from "@/components/dashboard/filter-bar";
import { useClientPagination } from "@/lib/use-pagination";
import type { DashboardFilters } from "@/lib/dashboard-filters";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getKriteriaBarangjasa } from "@/models/kriteria-barangjasa";
import { getMetodePemilihan } from "@/models/metode-pemilihan";
import { getSkalaPaket } from "@/models/skala-paket";
import { getStatusSurat } from "@/models/status-surat";
import { getTopPaketRealisasi } from "@/models/top-paket-realisasi";
import { getTopPenyedia } from "@/models/top-penyedia";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

function toFiniteNumber(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function formatLargeCurrency(val: unknown) {
  const safe = toFiniteNumber(val, 0);
  return `Rp ${(safe / 1_000_000_000).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} M`;
}

type PieDatum = { name: string; value: number; share: number };

type ProsesDashboardViewProps = {
  embedded?: boolean;
  startDate?: string;
  endDate?: string;
};

export function ProsesDashboardView({ embedded = false, startDate, endDate }: ProsesDashboardViewProps) {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [filters, setFilters] = useState<DashboardFilters>({});
  const effectiveFilters = useMemo<DashboardFilters>(() => ({
    ...filters,
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }), [filters, startDate, endDate]);
  const filtersKey = useMemo(() => JSON.stringify(effectiveFilters), [effectiveFilters]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    metode: Awaited<ReturnType<typeof getMetodePemilihan>> | null;
    topPaket: Awaited<ReturnType<typeof getTopPaketRealisasi>> | null;
    topPenyedia: Awaited<ReturnType<typeof getTopPenyedia>> | null;
    statusSurat: Awaited<ReturnType<typeof getStatusSurat>> | null;
    skala: Awaited<ReturnType<typeof getSkalaPaket>> | null;
    kriteria: Awaited<ReturnType<typeof getKriteriaBarangjasa>> | null;
  }>({
    metode: null,
    topPaket: null,
    topPenyedia: null,
    statusSurat: null,
    skala: null,
    kriteria: null,
  });

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
    if (!authReady || !isAuthed) return;
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      getMetodePemilihan(effectiveFilters),
      getTopPaketRealisasi(effectiveFilters),
      getTopPenyedia(effectiveFilters),
      getStatusSurat(effectiveFilters),
      getSkalaPaket(effectiveFilters),
      getKriteriaBarangjasa(effectiveFilters),
    ]).then((results) => {
      if (cancelled) return;
      const [rm, r0, r1, r2, r3, r4] = results;
      setData({
        metode: rm.status === "fulfilled" ? rm.value : null,
        topPaket: r0.status === "fulfilled" ? r0.value : null,
        topPenyedia: r1.status === "fulfilled" ? r1.value : null,
        statusSurat: r2.status === "fulfilled" ? r2.value : null,
        skala: r3.status === "fulfilled" ? r3.value : null,
        kriteria: r4.status === "fulfilled" ? r4.value : null,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, isAuthed, filtersKey]);

  useEffect(() => {
    if (!authReady || isAuthed) return;
    router.replace("/login");
  }, [authReady, isAuthed, router]);

  const metodePieData = useMemo((): PieDatum[] => {
    const rows = data.metode;
    if (!rows?.length) return [];
    const mapped = rows.map((m) => ({
      name: m.metode?.trim() || "-",
      value: toFiniteNumber(m.count),
      share: 0,
    }));
    const total = mapped.reduce((s, r) => s + r.value, 0);
    return mapped.map((r) => ({
      ...r,
      share: total > 0 ? (r.value / total) * 100 : 0,
    }));
  }, [data.metode]);

  const statusSuratPieData = useMemo((): PieDatum[] => {
    const rows = data.statusSurat;
    if (!rows?.length) return [];
    const mapped = rows.map((x) => ({
      name: x.status?.trim() || "-",
      value: toFiniteNumber(x.count),
      share: 0,
    }));
    const total = mapped.reduce((s, r) => s + r.value, 0);
    return mapped.map((r) => ({
      ...r,
      share: total > 0 ? (r.value / total) * 100 : 0,
    }));
  }, [data.statusSurat]);

  const topPaketPager = useClientPagination(data.topPaket, 10);
  const topPenyediaPager = useClientPagination(data.topPenyedia, 10);

  const kriteriaPieData = useMemo((): PieDatum[] => {
    const rows = data.kriteria;
    if (!rows?.length) return [];
    const mapped = rows.map((x) => ({
      name: x.kriteria?.trim() || "-",
      value: toFiniteNumber(x.count),
      share: 0,
    }));
    const total = mapped.reduce((s, r) => s + r.value, 0);
    return mapped.map((r) => ({
      ...r,
      share: total > 0 ? (r.value / total) * 100 : 0,
    }));
  }, [data.kriteria]);

  if (!authReady || !isAuthed) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Memuat…
      </div>
    );
  }

  return (
    <div className={embedded ? "flex h-full min-h-0 flex-col bg-[#F7FBFF]" : "min-h-screen bg-[#F7FBFF]"}>
      {!embedded && (
      <header className="sticky top-0 z-10 border-b border-[#E1ECF7] bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <Link
            href="/"
            className="text-sm text-[#2563eb] hover:underline w-fit"
          >
            ← Kembali ke overview
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[#0B1E33]">
              Dashboard proses
            </h1>
            <p className="text-xs text-[#5B6B7F]">
              Metode pemilihan, top realisasi, skala paket, status surat,
              kriteria barang/jasa, dan penyedia teratas (data API).
            </p>
          </div>
        </div>
      </header>
      )}

      <main className={embedded ? "flex h-full min-h-0 flex-col gap-3 overflow-hidden px-1 py-1" : "mx-auto max-w-7xl space-y-3 px-4 py-4 lg:px-6 lg:py-6"}>
        <DashboardFilterBar value={filters} onChange={setFilters} mode="proc" />

        <div className="grid shrink-0 gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm border-[#E1ECF7]">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Metode Pemilihan
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-4">
              {loading && metodePieData.length === 0 ? (
                <Skeleton className="h-44 w-full max-w-sm rounded-full" />
              ) : metodePieData.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tidak ada data</p>
              ) : (
                <div className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <div className="h-44 w-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metodePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={72}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {metodePieData.map((_, index) => (
                            <Cell
                              key={`met-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            Number(value ?? 0).toLocaleString("id-ID"),
                            "Paket",
                          ]}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full max-w-[220px] space-y-1 text-[11px]">
                    {metodePieData.slice(0, 8).map((entry, index) => (
                      <div
                        key={`${entry.name}-${index}`}
                        className="flex justify-between gap-2 border-b border-dashed border-gray-100 pb-1 last:border-0"
                      >
                        <span
                          className="truncate text-muted-foreground"
                          title={entry.name}
                        >
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-medium">
                          {entry.share.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#E1ECF7]">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Skala Paket</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] p-2">
              {loading && !(data.skala && data.skala.length) ? (
                <Skeleton className="h-full min-h-[180px] w-full rounded-lg" />
              ) : data.skala && data.skala.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    layout="vertical"
                    data={data.skala.slice(0, 10).map((s) => ({
                      name: s.skala?.trim() || "-",
                      count: toFiniteNumber(s.count),
                    }))}
                    margin={{ top: 4, right: 10, left: 0, bottom: 4 }}
                    barSize={14}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={88}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickFormatter={(val: string) =>
                        val.length > 12 ? val.substring(0, 12) + "…" : val
                      }
                      interval={0}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                      formatter={(val) => [
                        Number(val ?? 0).toLocaleString("id-ID"),
                        "Paket",
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {data.skala.slice(0, 10).map((_, index) => (
                        <Cell
                          key={`sk-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="flex min-h-[160px] items-center justify-center text-xs text-muted-foreground">
                  Tidak ada data
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid shrink-0 gap-3 grid-cols-1 lg:grid-cols-2">
          <Card className="flex min-h-0 flex-col overflow-hidden border-[#E1ECF7] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Top Paket Realisasi</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-[350px] max-h-[420px] flex-col p-0">
              {loading && !(data.topPaket && data.topPaket.length) ? (
                <Skeleton className="m-3 h-40 w-[calc(100%-1.5rem)] rounded-lg" />
              ) : data.topPaket && data.topPaket.length > 0 ? (
                <>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 font-medium">Nama Paket</th>
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 font-medium">Penyedia</th>
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right font-medium">Realisasi</th>
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right font-medium">Kontrak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {topPaketPager.pageItems.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/20">
                            <td className="px-3 py-2 align-top"><span className="line-clamp-2" title={row.paket_pbj_nama}>{row.paket_pbj_nama}</span></td>
                            <td className="px-3 py-2 align-top text-muted-foreground"><span className="line-clamp-2" title={row.perusahaan_nama}>{row.perusahaan_nama}</span></td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">{formatLargeCurrency(row.nilai_realisasi)}</td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">{formatLargeCurrency(row.nilai_kontrak)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <TablePager
                    page={topPaketPager.page}
                    perPage={topPaketPager.perPage}
                    total={topPaketPager.total}
                    onPageChange={topPaketPager.setPage}
                    onPerPageChange={topPaketPager.setPerPage}
                  />
                </>
              ) : (
                <p className="p-6 text-center text-xs text-muted-foreground">Tidak ada data</p>
              )}
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden border-[#E1ECF7] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Top Penyedia</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-[350px] max-h-[420px] flex-col p-0">
              {loading && !(data.topPenyedia && data.topPenyedia.length) ? (
                <Skeleton className="m-3 h-40 w-[calc(100%-1.5rem)] rounded-lg" />
              ) : data.topPenyedia && data.topPenyedia.length > 0 ? (
                <>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 font-medium">Paket</th>
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 font-medium">Perusahaan</th>
                          <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right font-medium">Realisasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {topPenyediaPager.pageItems.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/20">
                            <td className="px-3 py-2 align-top max-w-[140px]"><span className="line-clamp-2" title={row.paket_pbj_nama}>{row.paket_pbj_nama}</span></td>
                            <td className="px-3 py-2 align-top text-muted-foreground max-w-[140px]"><span className="line-clamp-2" title={row.perusahaan_nama}>{row.perusahaan_nama}</span></td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">{formatLargeCurrency(row.nilai_realisasi ?? row.nilai_kontrak)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <TablePager
                    page={topPenyediaPager.page}
                    perPage={topPenyediaPager.perPage}
                    total={topPenyediaPager.total}
                    onPageChange={topPenyediaPager.setPage}
                    onPerPageChange={topPenyediaPager.setPerPage}
                  />
                </>
              ) : (
                <p className="p-6 text-center text-xs text-muted-foreground">Tidak ada data</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid flex-1 min-h-0 gap-3 grid-cols-1 lg:grid-cols-2">
          <Card className="flex min-h-0 flex-col border-[#E1ECF7] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Status Surat</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-3">
              {loading && statusSuratPieData.length === 0 ? (
                <Skeleton className="h-36 w-full rounded-lg" />
              ) : statusSuratPieData.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tidak ada data</p>
              ) : (
                <>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusSuratPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={52}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {statusSuratPieData.map((_, index) => (
                            <Cell
                              key={`st-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            Number(value ?? 0).toLocaleString("id-ID"),
                            "Paket",
                          ]}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 max-h-20 w-full overflow-y-auto text-[10px] space-y-0.5">
                    {statusSuratPieData.slice(0, 8).map((entry, index) => (
                      <div
                        key={`${entry.name}-${index}`}
                        className="flex justify-between gap-2"
                      >
                        <span
                          className="truncate text-muted-foreground"
                          title={entry.name}
                        >
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-medium">
                          {entry.share.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col border-[#E1ECF7] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-b py-3">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Kriteria Barang/Jasa
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-3">
              {loading && kriteriaPieData.length === 0 ? (
                <Skeleton className="h-36 w-full rounded-lg" />
              ) : kriteriaPieData.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tidak ada data</p>
              ) : (
                <>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={kriteriaPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={52}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {kriteriaPieData.map((_, index) => (
                            <Cell
                              key={`kr-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            Number(value ?? 0).toLocaleString("id-ID"),
                            "Paket",
                          ]}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 max-h-20 w-full overflow-y-auto text-[10px] space-y-0.5">
                    {kriteriaPieData.slice(0, 8).map((entry, index) => (
                      <div
                        key={`${entry.name}-${index}`}
                        className="flex justify-between gap-2"
                      >
                        <span
                          className="truncate text-muted-foreground"
                          title={entry.name}
                        >
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-medium">
                          {entry.share.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
