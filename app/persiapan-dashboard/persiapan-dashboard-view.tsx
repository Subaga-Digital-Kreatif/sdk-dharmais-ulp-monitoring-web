"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, PieChart as PieChartIcon, Table2 } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePager } from "@/components/ui/table-pager";
import { DashboardFilterBar } from "@/components/dashboard/filter-bar";
import { useClientPagination } from "@/lib/use-pagination";
import type { DashboardFilters } from "@/lib/dashboard-filters";
import { getModalVsOperasional } from "@/models/modal-vs-operasional";
import { getPaguPerMak } from "@/models/pagu-per-mak";
import { getPaguPerPpk } from "@/models/pagu-per-ppk";
import { getPaketPerEnduser } from "@/models/paket-per-enduser";
import { getPersiapanList } from "@/models/persiapan-list";
import { getPersiapanSummary } from "@/models/persiapan-summary";

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
  if (typeof val === "number") return Number.isFinite(val) ? val : fallback;
  if (typeof val === "string") {
    const raw = val.trim();
    if (!raw) return fallback;
    const cleaned = raw.replace(/[^\d.,-]/g, "");
    let normalized = cleaned;
    if (cleaned.includes(".") && cleaned.includes(",")) {
      const lastDot = cleaned.lastIndexOf(".");
      const lastComma = cleaned.lastIndexOf(",");
      const decimalSep = lastDot > lastComma ? "." : ",";
      const thousandsSep = decimalSep === "." ? "," : ".";
      normalized = cleaned.split(thousandsSep).join("");
      if (decimalSep === ",") normalized = normalized.replace(",", ".");
    } else if (cleaned.includes(".") && cleaned.split(".").length > 2) {
      normalized = cleaned.split(".").join("");
    } else if (cleaned.includes(",") && cleaned.split(",").length > 2) {
      normalized = cleaned.split(",").join("");
    } else if (cleaned.includes(",") && !cleaned.includes(".")) {
      normalized = cleaned.replace(",", ".");
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function formatCompactIdr(val: unknown) {
  const safe = toFiniteNumber(val, 0);
  return `Rp ${(safe / 1_000_000_000).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} M`;
}

function formatIdrFull(val: unknown) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(toFiniteNumber(val, 0));
}

type PersiapanDashboardViewProps = {
  embedded?: boolean;
  startDate?: string;
  endDate?: string;
};

export function PersiapanDashboardView({ embedded = false, startDate, endDate }: PersiapanDashboardViewProps) {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    summary: Awaited<ReturnType<typeof getPersiapanSummary>> | null;
    modalVsOperasional: Awaited<ReturnType<typeof getModalVsOperasional>> | null;
    paguPerMak: Awaited<ReturnType<typeof getPaguPerMak>> | null;
    paguPerPpk: Awaited<ReturnType<typeof getPaguPerPpk>> | null;
    paketPerEnduser: Awaited<ReturnType<typeof getPaketPerEnduser>> | null;
    persiapanList: Awaited<ReturnType<typeof getPersiapanList>> | null;
  }>({
    summary: null,
    modalVsOperasional: null,
    paguPerMak: null,
    paguPerPpk: null,
    paketPerEnduser: null,
    persiapanList: null,
  });

  const [filters, setFilters] = useState<DashboardFilters>({});
  const [persiapanPage, setPersiapanPage] = useState(1);
  const [persiapanPerPage, setPersiapanPerPage] = useState(25);
  const [persiapanLoading, setPersiapanLoading] = useState(false);
  const ppkPager = useClientPagination(data.paguPerPpk, 10);
  const enduserPager = useClientPagination(data.paketPerEnduser, 10);

  // Merge top-level period (from parent) with locally-set chip filters.
  // Period from the parent takes precedence over any local startDate/endDate.
  const effectiveFilters = useMemo<DashboardFilters>(() => ({
    ...filters,
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }), [filters, startDate, endDate]);

  const filtersKey = useMemo(() => JSON.stringify(effectiveFilters), [effectiveFilters]);

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
      getPersiapanSummary(effectiveFilters),
      getModalVsOperasional(effectiveFilters),
      getPaguPerMak(effectiveFilters),
      getPaguPerPpk(effectiveFilters),
      getPaketPerEnduser(effectiveFilters),
      getPersiapanList({ page: 1, perPage: persiapanPerPage, ...effectiveFilters }),
    ]).then((results) => {
      if (cancelled) return;
      const [r0, r1, r2, r3, r4, r5] = results;
      const summaryRaw = r0.status === "fulfilled" ? (r0.value as any) : null;
      const summaryValue =
        summaryRaw && typeof summaryRaw === "object" && "data" in summaryRaw
          ? summaryRaw.data
          : summaryRaw;
      setData({
        summary: summaryValue,
        modalVsOperasional: r1.status === "fulfilled" ? r1.value : null,
        paguPerMak: r2.status === "fulfilled" ? r2.value : null,
        paguPerPpk: r3.status === "fulfilled" ? r3.value : null,
        paketPerEnduser: r4.status === "fulfilled" ? r4.value : null,
        persiapanList: r5.status === "fulfilled" ? r5.value : null,
      });
      setPersiapanPage(1);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // re-runs when auth or filter set changes; persiapan list paging handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, isAuthed, filtersKey]);

  useEffect(() => {
    if (!authReady || !isAuthed || loading || persiapanPage === 1) return;
    let cancelled = false;
    setPersiapanLoading(true);
    getPersiapanList({ page: persiapanPage, perPage: persiapanPerPage, ...effectiveFilters })
      .then((res) => {
        if (cancelled) return;
        setData((prev) => ({ ...prev, persiapanList: res }));
      })
      .catch(() => {
        if (cancelled) return;
        setData((prev) => ({ ...prev, persiapanList: null }));
      })
      .finally(() => {
        if (!cancelled) setPersiapanLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, isAuthed, persiapanPage, persiapanPerPage, filtersKey]);

  useEffect(() => {
    if (!authReady || isAuthed) return;
    router.replace("/login");
  }, [authReady, isAuthed, router]);

  const modalPieData = useMemo(() => {
    const m = data.modalVsOperasional;
    if (!m) return [];
    return [
      {
        name: "Modal",
        value: toFiniteNumber(m.totalModal),
        share: toFiniteNumber(m.persentaseModal),
      },
      {
        name: "Operasional",
        value: toFiniteNumber(m.totalOperasional),
        share: toFiniteNumber(m.persentaseOperasional),
      },
    ];
  }, [data.modalVsOperasional]);

  const makBarData = useMemo(
    () =>
      (data.paguPerMak ?? []).slice(0, 8).map((m) => ({
        name: m.mak_kode || "-",
        pagu: toFiniteNumber(m.total_pagu),
      })),
    [data.paguPerMak],
  );

  if (!authReady || !isAuthed) {
    return <div className="min-h-[40vh] bg-[#F7FBFF]" />;
  }

  return (
    <div className={embedded ? "flex h-full min-h-0 flex-col overflow-hidden bg-[#F7FBFF]" : "flex h-screen flex-col overflow-hidden bg-[#F7FBFF]"}>
      {!embedded && (
      <header className="shrink-0 border-b border-[#E1ECF7] bg-white px-4 py-3 lg:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          <Link href="/" className="w-fit text-sm text-[#2563eb] hover:underline">
            ← Kembali ke dashboard utama
          </Link>
          <h1 className="text-lg font-semibold text-[#0B1E33]">Dashboard Persiapan</h1>
        </div>
      </header>
      )}

      <main className={embedded ? "flex h-full w-full flex-col gap-3 overflow-hidden px-1 py-1" : "mx-auto flex h-full w-full max-w-7xl flex-col gap-3 overflow-hidden px-4 py-4 lg:px-6"}>
        <DashboardFilterBar value={filters} onChange={setFilters} mode="prep" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card><CardContent className="p-4">{loading ? <Skeleton className="h-8 w-full" /> : <div><p className="text-xs text-muted-foreground">Total Paket</p><p className="text-xl font-semibold">{toFiniteNumber(data.summary?.totalPaket).toLocaleString("id-ID")}</p></div>}</CardContent></Card>
          <Card><CardContent className="p-4">{loading ? <Skeleton className="h-8 w-full" /> : <div><p className="text-xs text-muted-foreground">Total Pagu</p><p className="text-xl font-semibold">{formatCompactIdr(data.summary?.totalPagu)}</p></div>}</CardContent></Card>
          <Card><CardContent className="p-4">{loading ? <Skeleton className="h-8 w-full" /> : <div><p className="text-xs text-muted-foreground">Total HPS</p><p className="text-xl font-semibold">{formatIdrFull(data.summary?.totalHps)}</p></div>}</CardContent></Card>
          <Card><CardContent className="p-4">{loading ? <Skeleton className="h-8 w-full" /> : <div><p className="text-xs text-muted-foreground">Paket / Hari</p><p className="text-xl font-semibold">{toFiniteNumber(data.summary?.jumlahPerHari).toLocaleString("id-ID")}</p></div>}</CardContent></Card>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto lg:grid-cols-12 lg:overflow-hidden">
        <Card className="flex min-h-0 flex-col lg:col-span-4">
          <CardHeader className="py-3"><CardTitle className="flex items-center gap-2 text-sm"><PieChartIcon className="h-4 w-4" />Modal vs Operasional</CardTitle></CardHeader>
          <CardContent className="min-h-0 flex-1">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <div className="flex h-full flex-col">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={modalPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={62}>
                        {modalPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCompactIdr(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 overflow-auto text-xs">
                  {modalPieData.map((x) => <div key={x.name} className="flex justify-between"><span>{x.name}</span><span>{x.share.toFixed(1)}%</span></div>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col lg:col-span-4">
          <CardHeader className="py-3"><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4" />Pagu per MAK</CardTitle></CardHeader>
          <CardContent className="min-h-0 flex-1">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={makBarData} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCompactIdr(v)} />
                  <Bar dataKey="pagu" radius={[0, 4, 4, 0]}>
                    {makBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col lg:col-span-4">
          <CardHeader className="py-3"><CardTitle className="flex items-center gap-2 text-sm"><Table2 className="h-4 w-4" />Pagu per PPK</CardTitle></CardHeader>
          <CardContent className="flex min-h-[350px] max-h-[420px] flex-col p-0">
            {loading ? <Skeleton className="m-3 h-24 w-[calc(100%-1.5rem)]" /> : (
              <>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-left">PPK</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right">Paket</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right">Pagu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ppkPager.pageItems.map((r) => (
                        <tr key={r.ppk_kode}>
                          <td className="px-3 py-2"><div className="line-clamp-2">{r.ppk_nomenklatur || r.ppk_kode}</div></td>
                          <td className="px-3 py-2 text-right">{toFiniteNumber(r.jumlah_paket).toLocaleString("id-ID")}</td>
                          <td className="px-3 py-2 text-right">{formatCompactIdr(r.total_pagu)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePager
                  page={ppkPager.page}
                  perPage={ppkPager.perPage}
                  total={ppkPager.total}
                  onPageChange={ppkPager.setPage}
                  onPerPageChange={ppkPager.setPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col lg:col-span-6">
          <CardHeader className="py-3"><CardTitle className="text-sm">Paket per Enduser</CardTitle></CardHeader>
          <CardContent className="flex min-h-[300px] max-h-[420px] flex-col p-0">
            {loading ? <Skeleton className="m-3 h-24 w-[calc(100%-1.5rem)]" /> : (
              <>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-left">Unit</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right">Paket</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right">Pagu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {enduserPager.pageItems.map((r) => (
                        <tr key={r.satker_unit_kode}>
                          <td className="px-3 py-2"><div className="line-clamp-2">{r.satker_unit_nama}</div></td>
                          <td className="px-3 py-2 text-right">{toFiniteNumber(r.jumlah_paket).toLocaleString("id-ID")}</td>
                          <td className="px-3 py-2 text-right">{formatCompactIdr(r.total_pagu)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePager
                  page={enduserPager.page}
                  perPage={enduserPager.perPage}
                  total={enduserPager.total}
                  onPageChange={enduserPager.setPage}
                  onPerPageChange={enduserPager.setPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col lg:col-span-6">
          <CardHeader className="py-3"><CardTitle className="text-sm">Daftar Persiapan</CardTitle></CardHeader>
          <CardContent className="flex min-h-[350px] max-h-[420px] flex-col p-0">
            {loading ? <Skeleton className="m-3 h-24 w-[calc(100%-1.5rem)]" /> : (
              <>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-left">Paket</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-left">Enduser</th>
                        <th className="sticky top-0 z-10 bg-white px-3 py-2 text-right">Pagu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(data.persiapanList?.data ?? []).map((r) => (
                        <tr key={r.id}>
                          <td className="px-3 py-2"><div className="line-clamp-2">{r.paketPbjNama}</div></td>
                          <td className="px-3 py-2"><div className="line-clamp-2">{r.satkerUnitEnduser?.satkerUnitNama ?? "-"}</div></td>
                          <td className="px-3 py-2 text-right">{formatCompactIdr(r.anggaranPaguAktif)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePager
                  page={persiapanPage}
                  perPage={persiapanPerPage}
                  total={toFiniteNumber(data.persiapanList?.meta?.total)}
                  loading={persiapanLoading}
                  onPageChange={setPersiapanPage}
                  onPerPageChange={(n) => {
                    setPersiapanPerPage(n);
                    setPersiapanPage(1);
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
