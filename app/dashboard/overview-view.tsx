import { useState, useMemo, useEffect, type ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Layers,
  FileText,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Legend,
  PieChart,
  Pie,
} from "recharts";

import {
  CommonViewProps,
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import { calculateUlpStats } from "./ulp-stats";
import { getOverview, type OverviewResponse } from "@/models/overview";
import { getMetodePemilihan } from "@/models/metode-pemilihan";
import { getTopPaketRealisasi } from "@/models/top-paket-realisasi";
import { getPaketPerEnduser } from "@/models/paket-per-enduser";
import { cn } from "@/lib/utils";

type OverviewModalType = "trend" | "breakdown" | "risk" | null;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

function toFiniteNumber(val: unknown, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/** Formats IDR in billions (M); tolerates missing/invalid API values. */
function formatLargeCurrency(val: unknown) {
  const safe = toFiniteNumber(val, 0);
  return `Rp ${(safe / 1_000_000_000).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} M`;
}

type OverviewKpiRowItem = {
  label: string;
  icon: LucideIcon;
  value: ReactNode;
  helper?: ReactNode;
  valueClassName?: string;
  valueTitle?: string;
};

type OverviewKpiCardProps = {
  label: string;
  icon: LucideIcon;
  loading: boolean;
  value: ReactNode;
  helper?: ReactNode;
  valueClassName?: string;
  valueTitle?: string;
};

function OverviewKpiCard({
  label,
  icon: Icon,
  loading,
  value,
  helper,
  valueClassName,
  valueTitle,
}: OverviewKpiCardProps) {
  return (
    <Card className="shadow-sm flex flex-col justify-center border-[#E1ECF7]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div
              className={cn(
                "font-bold text-[#0B1E33]",
                valueClassName ?? "text-xl lg:text-2xl",
              )}
              title={valueTitle}
            >
              {value}
            </div>
            {helper != null && (
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-1">
                {helper}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function OverviewView({ isLoading, data }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<OverviewModalType>(null);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [overviewStatus, setOverviewStatus] = useState<
    "loading" | "ok" | "error"
  >("loading");
  const [overviewApiLoading, setOverviewApiLoading] = useState(true);
  const [overviewApiData, setOverviewApiData] = useState<{
    metode: Awaited<ReturnType<typeof getMetodePemilihan>> | null;
    topPaket: Awaited<ReturnType<typeof getTopPaketRealisasi>> | null;
    enduser: Awaited<ReturnType<typeof getPaketPerEnduser>> | null;
  }>({
    metode: null,
    topPaket: null,
    enduser: null,
  });

  useEffect(() => {
    let cancelled = false;
    getOverview()
      .then((d) => {
        if (!cancelled) {
          setOverview(d);
          setOverviewStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) setOverviewStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getMetodePemilihan(),
      getTopPaketRealisasi(),
      getPaketPerEnduser(),
    ]).then((results) => {
      if (cancelled) return;
      const [m, p, e] = results;
      setOverviewApiData({
        metode: m.status === "fulfilled" ? m.value : null,
        topPaket: p.status === "fulfilled" ? p.value : null,
        enduser: e.status === "fulfilled" ? e.value : null,
      });
      setOverviewApiLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => calculateUlpStats(data), [data]);

  const trendData = useMemo(() => {
    return stats.trendData.map(d => ({
      label: d.date,
      paguM: d.pagu,
      hpsM: d.hps,
      count: d.count,
      efficiency: d.pagu > 0 ? ((d.pagu - d.hps) / d.pagu) * 100 : 0
    }));
  }, [stats.trendData]);

  const realisasiStatsData = useMemo(() => {
    if (overviewApiData.topPaket && overviewApiData.topPaket.length > 0) {
      return overviewApiData.topPaket.slice(0, 10).map((x) => {
        const kontrak = toFiniteNumber(x.nilai_kontrak);
        const realisasi = toFiniteNumber(x.nilai_realisasi);
        return {
          label: x.paket_pbj_nama,
          paguM: kontrak,
          hpsM: realisasi,
          count: 1,
          efficiency: kontrak > 0 ? (realisasi / kontrak) * 100 : 0,
          source: "api" as const,
        };
      });
    }
    return trendData.map((x) => ({ ...x, source: "local" as const }));
  }, [overviewApiData.topPaket, trendData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(val);
  };

  const kpiBusy =
    overviewStatus === "loading" ||
    (overviewStatus === "error" && isLoading);

  const kpiItems = useMemo((): OverviewKpiRowItem[] => {
    if (overviewStatus === "ok" && overview) {
      const o = overview;
      const pagu = toFiniteNumber(o.totalPagu);
      const hps = toFiniteNumber(o.totalHps);
      const packages = toFiniteNumber(o.totalPaket);
      const realisasiPct = toFiniteNumber(o.persentaseRealisasi);
      const hpsRatio =
        pagu > 0 ? ((hps / pagu) * 100).toFixed(1) : "0.0";
      return [
        {
          label: "Total Pagu",
          icon: DollarSign,
          value: formatLargeCurrency(o.totalPagu),
          helper: `${packages.toLocaleString("id-ID")} paket terdaftar`,
        },
        {
          label: "Total HPS",
          icon: Activity,
          value: formatLargeCurrency(o.totalHps),
          helper: (
            <>
              <span className="text-emerald-600 font-medium">{hpsRatio}%</span>
              <span>rasio terhadap Pagu</span>
            </>
          ),
        },
        {
          label: "Total Realisasi",
          icon: TrendingUp,
          value: formatLargeCurrency(o.totalRealisasi),
          valueClassName: "text-emerald-600",
          helper: (
            <>
              <span>{realisasiPct.toFixed(1)}%</span>
              <span>persentase realisasi</span>
            </>
          ),
        },
        {
          label: "Nilai Kontrak",
          icon: FileText,
          value: formatLargeCurrency(o.totalNilaiKontrak),
          helper: "Akumulasi nilai kontrak",
        },
      ];
    }

    const topMethod = stats.byMethod[0];
    return [
      {
        label: "Total Pagu",
        icon: DollarSign,
        value: formatLargeCurrency(stats.totalPagu),
        helper: `Dari ${stats.totalPackages} paket terdaftar`,
      },
      {
        label: "Total HPS",
        icon: Activity,
        value: formatLargeCurrency(stats.totalHps),
        helper: (
          <>
            <span className="text-emerald-600 font-medium">
              {(stats.totalPagu > 0
                ? (stats.totalHps / stats.totalPagu) * 100
                : 0
              ).toFixed(1)}
              %
            </span>
            <span>rasio terhadap Pagu</span>
          </>
        ),
      },
      {
        label: "Total Hemat",
        icon: TrendingUp,
        value: formatLargeCurrency(stats.totalSavings),
        valueClassName: "text-emerald-600",
        helper: `${stats.savingsPercentage.toFixed(1)}% efisiensi anggaran`,
      },
      {
        label: "Metode Top",
        icon: Layers,
        value: topMethod?.name ?? "-",
        valueClassName: "text-lg lg:text-xl truncate",
        valueTitle: topMethod?.name,
        helper: `${topMethod?.count ?? 0} paket (${(topMethod?.share ?? 0).toFixed(1)}% share)`,
      },
    ];
  }, [overviewStatus, overview, stats]);

  const metodeChartData = useMemo(() => {
    if (overviewApiData.metode && overviewApiData.metode.length > 0) {
      const total = overviewApiData.metode.reduce(
        (s, x) => s + toFiniteNumber(x.count),
        0,
      );
      return overviewApiData.metode.map((x) => ({
        name: x.metode || "-",
        value: toFiniteNumber(x.count),
        share: total > 0 ? (toFiniteNumber(x.count) / total) * 100 : 0,
        source: "api" as const,
      }));
    }
    return stats.byMethod.map((x) => ({
      name: x.name,
      value: x.pagu,
      share: x.share,
      source: "local" as const,
    }));
  }, [overviewApiData.metode, stats.byMethod]);

  const topPaketRows = useMemo(() => {
    if (overviewApiData.topPaket && overviewApiData.topPaket.length > 0) {
      return overviewApiData.topPaket.map((x) => ({
        id: x.id,
        name: x.paket_pbj_nama,
        unitOrVendor: x.perusahaan_nama,
        paguOrRealisasi: toFiniteNumber(x.nilai_realisasi),
        compareValue: toFiniteNumber(x.nilai_kontrak),
        fromApi: true,
      }));
    }
    return stats.topProjects.map((x, idx) => ({
      id: idx,
      name: x.name,
      unitOrVendor: x.unit,
      paguOrRealisasi: x.pagu,
      compareValue: x.hps,
      fromApi: false,
    }));
  }, [overviewApiData.topPaket, stats.topProjects]);

  const unitChartData = useMemo(() => {
    if (overviewApiData.enduser && overviewApiData.enduser.length > 0) {
      return overviewApiData.enduser.slice(0, 5).map((x) => ({
        name: x.satker_unit_nama || "-",
        value: toFiniteNumber(x.total_pagu),
        count: toFiniteNumber(x.jumlah_paket),
        source: "api" as const,
      }));
    }
    return stats.byUnitKerja.slice(0, 5).map((x) => ({
      name: x.name,
      value: x.pagu,
      count: x.count,
      source: "local" as const,
    }));
  }, [overviewApiData.enduser, stats.byUnitKerja]);

  let modal: React.ReactNode = null;
  if (activeModal === "trend") {
    const apiTrend = realisasiStatsData[0]?.source === "api";
    const headers = apiTrend
      ? ["Nama Paket", "Nilai Kontrak (Rp)", "Nilai Realisasi (Rp)", "Serapan (%)"]
      : ["Tanggal", "Pagu (Rp)", "HPS (Rp)", "Paket", "Efisiensi (%)"];
    const rows = realisasiStatsData.map((row) => [
      row.label,
      row.paguM,
      row.hpsM,
      ...(apiTrend ? [] : [row.count]),
      row.efficiency.toFixed(2),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = realisasiStatsData.map((row) => ({
        label: row.label,
        nilaiA: row.paguM,
        nilaiB: row.hpsM,
        jumlahPaket: row.count,
        persentase: row.efficiency,
      }));
      downloadCsv("overview-trend.csv", csvRows);
    };
    modal = (
      <DataModal
        title={apiTrend ? "Detail Statistik Realisasi" : "Detail Trend Harian"}
        description={apiTrend ? "Data API realisasi vs kontrak per paket." : "Data harian Pagu, HPS, dan Efisiensi."}
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "breakdown") {
    const headers = ["Unit Kerja", "Pagu (Rp)", "Jumlah Paket"];
    const rows = unitChartData.map((item) => [
      item.name,
      item.value,
      item.count,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = unitChartData.map((item) => ({
        unitKerja: item.name,
        pagu: item.value,
        jumlahPaket: item.count,
      }));
      downloadCsv("overview-breakdown.csv", csvRows);
    };
    modal = (
      <DataModal
        title="Detail Breakdown Unit Kerja"
        description="Statistik per Unit Kerja."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "risk") {
    const headers = [
      "Nama Paket",
      topPaketRows[0]?.fromApi ? "Penyedia" : "Unit Kerja",
      topPaketRows[0]?.fromApi ? "Nilai Realisasi (Rp)" : "Pagu (Rp)",
      topPaketRows[0]?.fromApi ? "Nilai Kontrak (Rp)" : "HPS (Rp)",
    ];
    const rows = topPaketRows.map((item) => [
      item.name,
      item.unitOrVendor,
      item.paguOrRealisasi,
      item.compareValue,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = topPaketRows.map((item) => ({
        namaPaket: item.name,
        unitAtauPenyedia: item.unitOrVendor,
        nilaiA: item.paguOrRealisasi,
        nilaiB: item.compareValue,
      }));
      downloadCsv("overview-top-projects.csv", csvRows);
    };
    modal = (
      <DataModal
        title={topPaketRows[0]?.fromApi ? "Top Paket Realisasi" : "Top 5 Paket Terbesar"}
        description={topPaketRows[0]?.fromApi ? "Data dari API proses pemilihan." : "Paket dengan nilai Pagu tertinggi (data periode)."}
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto lg:h-[calc(100vh-180px)] w-full">
      {/* 1. KPI Cards Row (Fixed Height on Desktop) */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 shrink-0">
        {kpiItems.map((item) => (
          <OverviewKpiCard
            key={item.label}
            label={item.label}
            icon={item.icon}
            loading={kpiBusy}
            value={item.value}
            helper={item.helper}
            valueClassName={item.valueClassName}
            valueTitle={item.valueTitle}
          />
        ))}
      </div>

      

      {/* 2. Main Grid Layout (Flexible Height) */}
      <div className="flex-1 grid gap-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 min-h-0">
        
        {/* Top Left: Trend Chart (2 cols) */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  {realisasiStatsData[0]?.source === "api"
                    ? "Statistik Realisasi Anggaran"
                    : "Trend Realisasi Anggaran"}
                </CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("trend")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2">
            {isLoading || overviewApiLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={realisasiStatsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPagu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="label" 
                    tick={{fontSize: 10, fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false} 
                    minTickGap={30}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{fontSize: 10, fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1_000_000_000).toFixed(0)}M`}
                    width={40}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{fontSize: 10, fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false}
                    unit="%"
                    domain={[0, 'auto']}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: any, name: any) => {
                      const apiTrend = realisasiStatsData[0]?.source === "api";
                      if (name === "Efisiensi" || name === "Serapan")
                        return [`${Number(value).toFixed(2)}%`, name];
                      if (apiTrend && (name === "Realisasi" || name === "Kontrak")) {
                        return [`Rp ${Number(value).toLocaleString('id-ID')}`, name];
                      }
                      return [`Rp ${Number(value).toLocaleString('id-ID')}`, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="paguM" 
                    name={realisasiStatsData[0]?.source === "api" ? "Kontrak" : "Pagu"} 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorPagu)" 
                    strokeWidth={2}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="hpsM" 
                    name={realisasiStatsData[0]?.source === "api" ? "Realisasi" : "HPS"} 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    barSize={12} 
                    fillOpacity={0.8}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="efficiency" 
                    name={realisasiStatsData[0]?.source === "api" ? "Serapan" : "Efisiensi"} 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Right: Method Pie (1 col) — data periode (CSV) */}
        <Card className="lg:col-span-1 shadow-sm flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Metode Pengadaan</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2 relative flex flex-col items-center justify-center">
              {isLoading || overviewApiLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : metodeChartData.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 text-center">Tidak ada data</p>
              ) : (
                <>
                  <div className="w-full h-[60%]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metodeChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                          >
                            {metodeChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             formatter={(value) => [
                               metodeChartData[0]?.source === "api"
                                 ? Number(value ?? 0).toLocaleString("id-ID")
                                 : formatCurrency(Number(value ?? 0)),
                               metodeChartData[0]?.source === "api" ? "Paket" : "Pagu",
                             ]}
                             contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="w-full h-[40%] text-[10px] space-y-1 overflow-y-auto px-2 custom-scrollbar">
                      {metodeChartData.slice(0, 4).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1 last:border-0">
                           <div className="flex items-center gap-1.5 truncate max-w-[120px]" title={entry.name}>
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                              <span className="truncate">{entry.name}</span>
                           </div>
                           <span className="font-medium text-gray-600">{toFiniteNumber(entry.share).toFixed(0)}%</span>
                        </div>
                      ))}
                   </div>
                </>
              )}
          </CardContent>
        </Card>

        {/* Bottom Left: Top paket */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0 bg-white z-10">
             <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  {topPaketRows[0]?.fromApi ? "Top Paket Realisasi" : "Top 5 Paket Terbesar"}
                </CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("risk")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
            {isLoading || overviewApiLoading ? (
              <Skeleton className="h-full w-full min-h-[120px]" />
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-muted/20 text-muted-foreground font-medium z-10">
                  <tr>
                    <th className="px-3 py-2 font-medium w-[40%]">Nama Paket</th>
                    <th className="px-3 py-2 font-medium w-[20%]">{topPaketRows[0]?.fromApi ? "Penyedia" : "Unit"}</th>
                    <th className="px-3 py-2 font-medium text-right w-[20%]">{topPaketRows[0]?.fromApi ? "Realisasi" : "Pagu"}</th>
                    <th className="px-3 py-2 font-medium text-right w-[20%]">{topPaketRows[0]?.fromApi ? "Kontrak" : "Efisiensi"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topPaketRows.map((project) => {
                     const efficiency = project.paguOrRealisasi > 0 ? ((project.paguOrRealisasi - project.compareValue) / project.paguOrRealisasi) * 100 : 0;
                     return (
                      <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 align-top">
                          <div className="line-clamp-2 font-medium text-gray-700" title={project.name}>
                            {project.name}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top text-gray-500">
                          <div className="line-clamp-1" title={project.unitOrVendor}>{project.unitOrVendor}</div>
                        </td>
                        <td className="px-3 py-2 align-top text-right font-medium text-gray-700">
                          {formatLargeCurrency(project.paguOrRealisasi)}
                        </td>
                        <td className="px-3 py-2 align-top text-right">
                          {project.fromApi ? (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                              {formatLargeCurrency(project.compareValue)}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${efficiency > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {efficiency.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Bottom Right: Top Unit Kerja */}
        <Card className="lg:col-span-1 shadow-sm flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">{unitChartData[0]?.source === "api" ? "Top Enduser" : "Top Unit Kerja"}</CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("breakdown")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2">
             {isLoading || overviewApiLoading ? (
               <Skeleton className="h-full w-full min-h-[120px]" />
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                    layout="vertical"
                    data={unitChartData}
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                    barSize={12}
                 >
                   <XAxis type="number" hide />
                   <YAxis 
                     type="category" 
                     dataKey="name" 
                     width={90} 
                     tick={{ fontSize: 10, fill: '#64748b' }}
                     tickFormatter={(val) => val.length > 12 ? val.substring(0, 12) + '...' : val}
                     interval={0}
                   />
                   <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                     formatter={(val: unknown, _name: unknown, payload: any) =>
                       payload?.payload?.source === "api"
                         ? [formatCurrency(Number(val ?? 0)), `${toFiniteNumber(payload?.payload?.count)} paket`]
                         : formatCurrency(Number(val ?? 0))
                     }
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                     {unitChartData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             )}
          </CardContent>
        </Card>

      </div>

      {modal}
    </div>
  );
}
