import { useState, useMemo, useEffect } from "react";
import { ListOrdered, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BarListPlaceholder,
  CommonViewProps,
  KpiStat,
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import { getOverview, type OverviewResponse } from "@/models/overview";
import { getMetodePemilihan } from "@/models/metode-pemilihan";
import { getTopPaketRealisasi } from "@/models/top-paket-realisasi";
import { getPaketPerEnduser } from "@/models/paket-per-enduser";

function toFiniteNumber(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export function AnggaranView({ isLoading }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<
    "trend" | "unit" | "top-projects" | null
  >(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiData, setApiData] = useState<{
    overview: OverviewResponse | null;
    metode: Awaited<ReturnType<typeof getMetodePemilihan>> | null;
    topPaket: Awaited<ReturnType<typeof getTopPaketRealisasi>> | null;
    enduser: Awaited<ReturnType<typeof getPaketPerEnduser>> | null;
  }>({
    overview: null,
    metode: null,
    topPaket: null,
    enduser: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getOverview(),
      getMetodePemilihan(),
      getTopPaketRealisasi(),
      getPaketPerEnduser(),
    ]).then((results) => {
      if (cancelled) return;
      const [o, m, t, e] = results;
      setApiData({
        overview: o.status === "fulfilled" ? o.value : null,
        metode: m.status === "fulfilled" ? m.value : null,
        topPaket: t.status === "fulfilled" ? t.value : null,
        enduser: e.status === "fulfilled" ? e.value : null,
      });
      setApiLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trendData = useMemo(
    () =>
      (apiData.topPaket ?? []).slice(0, 10).map((x) => {
        const kontrak = toFiniteNumber(x.nilai_kontrak);
        const realisasi = toFiniteNumber(x.nilai_realisasi);
        return {
          label: x.paket_pbj_nama,
          pagu: kontrak,
          hps: realisasi,
          saving: kontrak - realisasi,
        };
      }),
    [apiData.topPaket],
  );

  const unitRows = useMemo(() => {
    const rows = (apiData.enduser ?? []).map((u) => ({
      name: u.satker_unit_nama || "-",
      pagu: toFiniteNumber(u.total_pagu),
      count: toFiniteNumber(u.jumlah_paket),
    }));
    const total = rows.reduce((sum, r) => sum + r.pagu, 0);
    return rows.map((r) => ({
      ...r,
      share: total > 0 ? (r.pagu / total) * 100 : 0,
    }));
  }, [apiData.enduser]);

  const methodRows = useMemo(() => {
    const rows = (apiData.metode ?? []).map((m) => ({
      name: m.metode || "-",
      count: toFiniteNumber(m.count),
    }));
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    return rows.map((r) => ({
      ...r,
      share: total > 0 ? (r.count / total) * 100 : 0,
    }));
  }, [apiData.metode]);

  // Helper for rendering currency (adaptive units to avoid misleading 0 M)
  const fmtMoney = (val: number) => {
    const abs = Math.abs(val);
    if (abs >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
    }
    if (abs >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Jt`;
    }
    if (abs >= 1_000) {
      return `Rp ${(val / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Rb`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Calculate top savings projects
  const topSavings = useMemo(() => {
    return (apiData.topPaket ?? [])
      .map((d) => {
        const kontrak = toFiniteNumber(d.nilai_kontrak);
        const realisasi = toFiniteNumber(d.nilai_realisasi);
        return {
          name: d.paket_pbj_nama || "Unnamed",
          unit: d.perusahaan_nama || "-",
          pagu: kontrak,
          hps: realisasi,
          saving: kontrak - realisasi,
        };
      })
      .sort((a, b) => b.saving - a.saving)
      .slice(0, 5);
  }, [apiData.topPaket]);

  const totalKontrak = toFiniteNumber(apiData.overview?.totalNilaiKontrak);
  const totalRealisasi = toFiniteNumber(apiData.overview?.totalRealisasi);
  const totalGap = totalKontrak - totalRealisasi;
  const realisasiPercentage =
    totalKontrak > 0
      ? (totalRealisasi / totalKontrak) * 100
      : toFiniteNumber(apiData.overview?.persentaseRealisasi);
  const trendInsights = useMemo(() => {
    const paketCount = trendData.length;
    const totalSavingTopList = trendData.reduce((sum, x) => sum + x.saving, 0);
    const avgSaving = paketCount > 0 ? totalSavingTopList / paketCount : 0;
    const positiveCount = trendData.filter((x) => x.saving >= 0).length;
    const positiveShare = paketCount > 0 ? (positiveCount / paketCount) * 100 : 0;
    return {
      paketCount,
      avgSaving,
      positiveShare,
    };
  }, [trendData]);
  const sectionLoading = isLoading || apiLoading;

  let modal = null;

  if (activeModal === "trend") {
    const headers = ["Paket", "Nilai Kontrak", "Nilai Realisasi", "Selisih"];
    const rows = trendData.map((row) => [
      row.label,
      row.pagu.toLocaleString("id-ID"),
      row.hps.toLocaleString("id-ID"),
      row.saving.toLocaleString("id-ID"),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = trendData.map((row) => ({
        paket: row.label,
        nilaiKontrak: row.pagu,
        nilaiRealisasi: row.hps,
        selisih: row.saving,
      }));
      downloadCsv("ulp-trend-anggaran.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Statistik Realisasi"
        description="Perbandingan nilai kontrak dan nilai realisasi per paket."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "unit") {
    const headers = ["Unit Kerja", "Total Pagu", "Jumlah Paket", "Share (%)"];
    const rows = unitRows.map((item) => [
      item.name,
      item.pagu.toLocaleString("id-ID"),
      item.count,
      item.share.toFixed(1),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = unitRows.map((item) => ({
        unitKerja: item.name,
        totalPagu: item.pagu,
        jumlahPaket: item.count,
        share: item.share,
      }));
      downloadCsv("ulp-anggaran-unit-kerja.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Anggaran per Unit Kerja"
        description="Distribusi pagu anggaran berdasarkan unit kerja."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "top-projects") {
    const headers = ["Nama Paket", "Penyedia", "Nilai Kontrak", "Nilai Realisasi", "Selisih"];
    const rows = topSavings.map((item) => [
      item.name,
      item.unit,
      item.pagu.toLocaleString("id-ID"),
      item.hps.toLocaleString("id-ID"),
      item.saving.toLocaleString("id-ID"),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = topSavings.map((item) => ({
        namaPaket: item.name,
        penyedia: item.unit,
        nilaiKontrak: item.pagu,
        nilaiRealisasi: item.hps,
        selisih: item.saving,
      }));
      downloadCsv("ulp-top-efisiensi.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Top Efisiensi Paket"
        description="Paket dengan selisih kontrak dan realisasi terbesar."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  }

  return (
    <>
      <div className="grid h-full gap-4 grid-cols-1 lg:grid-cols-12 lg:grid-rows-[0.55fr_0.45fr] overflow-y-auto pb-4">
        {/* Row 1: Budget Trend & KPIs */}
        <Card className="flex flex-col lg:col-span-8 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Analisa Anggaran & Efisiensi</CardTitle>
              <CardDescription>
                Monitoring nilai kontrak vs realisasi dan selisihnya
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("trend")}
            >
              <ListOrdered className="mr-1 h-3 w-3" />
              Detail & Export
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <div className="grid gap-3 text-xs grid-cols-2 md:grid-cols-4">
              <KpiStat
                label="Total Kontrak"
                value={fmtMoney(totalKontrak)}
                helper="Akumulasi nilai kontrak"
                tone="neutral"
                icon={Wallet}
              />
              <KpiStat
                label="Total Realisasi"
                value={fmtMoney(totalRealisasi)}
                helper="Akumulasi nilai realisasi"
                tone="neutral"
                icon={DollarSign}
              />
              <KpiStat
                label="Selisih Kontrak"
                value={fmtMoney(totalGap)}
                helper="Kontrak - realisasi"
                tone={totalGap >= 0 ? "positive" : "negative"}
                icon={totalGap >= 0 ? TrendingUp : TrendingDown}
              />
              <KpiStat
                label="Rasio Realisasi"
                value={`${realisasiPercentage.toFixed(1)}%`}
                helper="% realisasi terhadap kontrak"
                tone={realisasiPercentage >= 100 ? "positive" : "neutral"}
                icon={realisasiPercentage >= 100 ? TrendingUp : TrendingDown}
              />
            </div>
            {sectionLoading ? (
              <Skeleton className="mt-1 h-40 w-full" />
            ) : (
              <div className="flex h-full flex-1 flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-[#5B6B7F]">
                  <span>Grafik Perbandingan Kontrak vs Realisasi</span>
                  <span>
                    {trendData.length > 0 ? `${trendData.length} paket data` : "Tidak ada data"}
                  </span>
                </div>
                <div className="min-h-[220px] flex-1 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendData}
                      margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#e5edff"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => (val / 1_000_000_000).toFixed(0) + "M"}
                      />
                      <Tooltip
                        cursor={{ fill: "#e5edff66" }}
                        contentStyle={{
                          backgroundColor: "#0B1E33",
                          borderRadius: 12,
                          border: "1px solid #1E3A8A",
                          fontSize: 11,
                          color: "#E5EEFF",
                        }}
                        formatter={(value: any) => ["Rp " + (Number(value) || 0).toLocaleString("id-ID"), ""]}
                      />
                      <Legend 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                      />
                      <Bar
                        dataKey="pagu"
                        radius={[4, 4, 0, 0]}
                        name="Nilai Kontrak"
                        fill="#3b82f6"
                        barSize={20}
                      />
                      <Bar
                        dataKey="hps"
                        radius={[4, 4, 0, 0]}
                        name="Nilai Realisasi"
                        fill="#10b981"
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-2 text-[11px] text-[#5B6B7F] md:grid-cols-3">
                  <div className="rounded-lg border bg-white p-2">
                    <div className="font-medium text-[#0B1E33]">Rata-rata Hemat/Paket</div>
                    <div className="text-xs text-emerald-600">{fmtMoney(trendInsights.avgSaving)}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-2">
                    <div className="font-medium text-[#0B1E33]">Paket Efisien</div>
                    <div className="text-xs text-[#0B1E33]">
                      {trendInsights.positiveShare.toFixed(1)}% dari {trendInsights.paketCount} paket
                    </div>
                  </div>
                  <div className="rounded-lg border bg-white p-2">
                    <div className="font-medium text-[#0B1E33]">Total Potensi Hemat</div>
                    <div className="text-xs text-emerald-600">{fmtMoney(totalGap)}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Row 1: Top Units by Pagu */}
        <Card className="flex flex-col lg:col-span-4 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Unit Pagu Terbesar</CardTitle>
              <CardDescription>Top unit kerja by Pagu</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("unit")}
            >
              <ListOrdered className="mr-1 h-3 w-3" />
              Detail
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {sectionLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <BarListPlaceholder
                title="Unit Kerja"
                items={unitRows.map((item) => ({
                  label: item.name,
                  primary: parseFloat(item.share.toFixed(1)),
                  secondary: item.share,
                }))}
              />
            )}
          </CardContent>
        </Card>

        {/* Row 2: Top Savings Projects */}
        <Card className="flex flex-col lg:col-span-6 lg:row-span-1">
           <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Top Efisiensi (Hemat)</CardTitle>
              <CardDescription>Paket dengan selisih kontrak-realisasi terbesar</CardDescription>
            </div>
             <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("top-projects")}
            >
              <ListOrdered className="mr-1 h-3 w-3" />
              Detail
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
             {sectionLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="space-y-4">
                {topSavings.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex flex-col gap-0.5 max-w-[60%]">
                      <span className="font-medium text-[#0B1E33] truncate" title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[#5B6B7F] truncate">{item.unit}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-emerald-600">
                        {fmtMoney(item.saving)}
                      </span>
                      <span className="text-[10px] text-[#5B6B7F]">
                        Kontrak: {fmtMoney(item.pagu)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Row 2: Budget Composition (Method) */}
        <Card className="flex flex-col lg:col-span-6 lg:row-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Distribusi Metode Pemilihan</CardTitle>
            <CardDescription>
              Komposisi jumlah paket berdasarkan metode pemilihan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
             {sectionLoading ? (
               <Skeleton className="h-full w-full" />
            ) : (
              <BarListPlaceholder
                title="Metode Pemilihan"
                items={methodRows.slice(0, 5).map((item) => ({
                  label: item.name,
                  primary: parseFloat(item.share.toFixed(1)),
                  secondary: item.share,
                }))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {modal}
    </>
  );
}
