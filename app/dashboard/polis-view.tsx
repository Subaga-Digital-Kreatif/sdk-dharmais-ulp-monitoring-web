import { useState } from "react";
import { AlertTriangle, CircleDollarSign, ListOrdered, ShieldCheck } from "lucide-react";
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
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BarListPlaceholder,
  CommonViewProps,
  KpiStat,
  MiniStat,
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import dashboardData from "@/data/dashboard-mock.json";

const polisTrendData = dashboardData.polis.trend;

const polisExpiryBuckets = dashboardData.polis.expiryBuckets;

const polisKpi = dashboardData.polis.kpi;

const polisQuality = dashboardData.polis.quality;

const firstTrendPoint = polisTrendData[0];
const lastTrendPoint = polisTrendData[polisTrendData.length - 1];

const totalUpcomingExpiry =
  polisExpiryBuckets.sevenDays +
  polisExpiryBuckets.thirtyDays +
  polisExpiryBuckets.ninetyDays;

const expiryDonutData = [
  {
    label: "7 Hari",
    value: polisExpiryBuckets.sevenDays,
    color: "#f97316",
  },
  {
    label: "30 Hari",
    value: polisExpiryBuckets.thirtyDays,
    color: "#3b82f6",
  },
  {
    label: "90 Hari",
    value: polisExpiryBuckets.ninetyDays,
    color: "#0ea5e9",
  },
];

const expiryChartData = expiryDonutData;

const qualityChartData = [
  {
    label: "Data Lengkap",
    value: polisQuality.dataLengkapPct,
    color: "#22c55e",
  },
  {
    label: "Data Kurang Lengkap",
    value: polisQuality.dataKurangLengkapPct,
    color: "#f97316",
  },
  {
    label: "Butuh Validasi Income",
    value: polisQuality.butuhValidasiIncomePct,
    color: "#0ea5e9",
  },
];

export function PolisView({ isLoading }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<
    "trend" | "composition" | "expiry" | "quality" | null
  >(null);

  let modal = null;

  if (activeModal === "trend") {
    const headers = [
      "Bulan",
      "Polis Aktif",
      "Polis Baru",
      "Polis Batal/Lapse",
    ];
    const rows = polisTrendData.map((row) => [
      row.label,
      row.active,
      row.newPolis,
      row.cancelled,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = polisTrendData.map((row) => ({
        bulan: row.label,
        polisAktif: row.active,
        polisBaru: row.newPolis,
        polisBatalLapse: row.cancelled,
      }));
      downloadCsv("polis-trend-polis-aktif.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Trend Polis Aktif"
        description="Data bulanan polis aktif, polis baru, dan batal/lapse."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "composition") {
    const headers = ["Dimensi", "Label", "Share (%)", "Coverage (%)"];
    const rows: (string | number)[][] = [
      ...dashboardData.polis.compositionByProduct.map((item) => [
        "Produk",
        item.label,
        item.sharePct,
        item.coveragePct,
      ]),
      ...dashboardData.polis.compositionByChannel.map((item) => [
        "Channel",
        item.label,
        item.sharePct,
        item.coveragePct,
      ]),
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        label: row[1],
        sharePct: row[2],
        coveragePct: row[3],
      }));
      downloadCsv("polis-komposisi-polis.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Komposisi Polis"
        description="Share dan coverage per jenis produk dan channel penjualan."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "expiry") {
    const headers = ["Bucket", "Jumlah Polis"];
    const rows: (string | number)[][] = [
      ...expiryDonutData.map((item) => [item.label, item.value]),
      ["Total 90 Hari", totalUpcomingExpiry],
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        bucket: row[0],
        jumlahPolis: row[1],
      }));
      downloadCsv("polis-jatuh-tempo.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Jatuh Tempo Polis"
        description="Rincian jumlah polis yang akan jatuh tempo per bucket hari."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "quality") {
    const headers = ["Kategori", "Nilai (%)"];
    const rows: (string | number)[][] = [
      ["Data Lengkap", polisQuality.dataLengkapPct],
      ["Data Kurang Lengkap", polisQuality.dataKurangLengkapPct],
      ["Butuh Validasi Income", polisQuality.butuhValidasiIncomePct],
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        kategori: row[0],
        nilaiPct: row[1],
      }));
      downloadCsv("polis-quality-data.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Quality Data Polis"
        description="Distribusi kelengkapan data dan kebutuhan validasi income."
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
      <div className="grid h-full gap-3 lg:grid-cols-12 lg:grid-rows-[0.55fr_0.45fr]">
        <Card className="flex flex-col lg:col-span-8 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Trend Polis Aktif</CardTitle>
              <CardDescription>
                Pergerakan polis aktif dan polis baru per bulan
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
          <div className="grid gap-3 text-xs md:grid-cols-4">
            <KpiStat
              label="Polis Aktif"
              value={polisKpi.policiesActive.toLocaleString("id-ID")}
              helper="Naik 3,1% vs bulan lalu"
              tone="positive"
            />
            <KpiStat
              label="Polis Baru Bulan Ini"
              value={polisKpi.policiesNewThisMonth.toLocaleString("id-ID")}
              helper="Fokus produk multiguna"
              tone="neutral"
            />
            <KpiStat
              label="Polis Batal / Lapse Bulan Ini"
              value={polisKpi.policiesCancelledThisMonth.toLocaleString("id-ID")}
              helper="Terkait pembayaran premi"
              tone="neutral"
            />
            <KpiStat
              label="Rasio Polis Aktif vs Kredit"
              value={`${polisKpi.ratioPolisVsKreditPct}%`}
              helper="Selaras coverage portofolio"
              tone="warning"
            />
          </div>
          {isLoading ? (
            <Skeleton className="mt-1 h-40 w-full" />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#5B6B7F]">
                <span>Trend Polis Aktif, Baru & Batal</span>
                <span>
                  {`${firstTrendPoint.active.toLocaleString(
                    "id-ID",
                  )} → ${lastTrendPoint.active.toLocaleString(
                    "id-ID",
                  )} polis`}
                </span>
              </div>
              <div className="h-40 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={polisTrendData}
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
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        Number(value ?? 0).toLocaleString("id-ID")
                      }
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        Number(value ?? 0).toLocaleString("id-ID")
                      }
                      domain={[0, 1200]}
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
                      formatter={(value: unknown, name: unknown) => {
                        const key = String(name ?? "");
                        const numeric = Number(value ?? 0);
                        if (key === "active") {
                          return [
                            `${numeric.toLocaleString("id-ID")} polis`,
                            "Polis Aktif",
                          ];
                        }
                        if (key === "newPolis") {
                          return [
                            `${numeric.toLocaleString("id-ID")} polis baru`,
                            "Polis Baru",
                          ];
                        }
                        if (key === "cancelled") {
                          return [
                            `${numeric.toLocaleString("id-ID")} batal/lapse`,
                            "Batal/Lapse",
                          ];
                        }
                        return [value as string | number | undefined, key];
                      }}
                      labelFormatter={(label) => `Bulan: ${label}`}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="active"
                      radius={[8, 8, 0, 0]}
                      name="active"
                      fill="#3b82f6"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="newPolis"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      name="newPolis"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cancelled"
                      stroke="#f97316"
                      strokeWidth={1.5}
                      dot={{ r: 1.5 }}
                      name="cancelled"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-4 lg:row-span-1">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div>
            <CardTitle>Komposisi Polis</CardTitle>
            <CardDescription>Per jenis produk dan channel penjualan</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("composition")}
          >
            <ListOrdered className="mr-1 h-3 w-3" />
            Detail & Export
          </Button>
        </CardHeader>
        <CardContent className="grid flex-1 gap-3 md:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <BarListPlaceholder
                title="Jenis Produk"
                items={dashboardData.polis.compositionByProduct.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.coveragePct,
                }))}
              />
              <BarListPlaceholder
                title="Channel Penjualan"
                items={dashboardData.polis.compositionByChannel.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.coveragePct,
                }))}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-5 lg:row-span-1">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div>
            <CardTitle>Jatuh Tempo Polis</CardTitle>
            <CardDescription>Fokus renewal 90 hari ke depan</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("expiry")}
          >
            <ListOrdered className="mr-1 h-3 w-3" />
            Detail & Export
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <KpiStat
                  label="7 Hari"
                  value={polisExpiryBuckets.sevenDays.toLocaleString("id-ID")}
                  helper="Prioritas tinggi"
                  tone="warning"
                />
                <KpiStat
                  label="30 Hari"
                  value={polisExpiryBuckets.thirtyDays.toLocaleString("id-ID")}
                  helper="Siapkan komunikasi"
                  tone="neutral"
                />
                <KpiStat
                  label="90 Hari"
                  value={polisExpiryBuckets.ninetyDays.toLocaleString("id-ID")}
                  helper="Proyeksi renewal"
                  tone="neutral"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-[1.3fr_1fr]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-[#5B6B7F]">
                    <span>Total Polis Akan Jatuh Tempo</span>
                    <span>{totalUpcomingExpiry.toLocaleString("id-ID")} polis</span>
                  </div>
                  <div className="h-24 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={expiryChartData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
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
                        />
                        <YAxis
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) =>
                            value.toLocaleString("id-ID")
                          }
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
                          formatter={(value: unknown) => {
                            const numeric = Number(value ?? 0);
                            return [
                              `${numeric.toLocaleString("id-ID")} polis`,
                              "Jatuh Tempo",
                            ];
                          }}
                          labelFormatter={(label) => `Dalam ${label}`}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {expiryChartData.map((item) => (
                            <Cell key={item.label} fill={item.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2 text-[11px]">
                  {expiryDonutData.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-[#F7FBFF] px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[#5B6B7F]">{item.label}</span>
                      </div>
                      <span className="font-semibold text-[#0B1E33]">
                        {item.value.toLocaleString("id-ID")} polis
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-7 lg:row-span-1">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div>
            <CardTitle>Quality Monitoring</CardTitle>
            <CardDescription>
              Status data debitur dan kelengkapan dokumen
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("quality")}
          >
            <ListOrdered className="mr-1 h-3 w-3" />
            Detail & Export
          </Button>
        </CardHeader>
        <CardContent className="grid flex-1 gap-4 md:grid-cols-3 text-xs">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <div className="col-span-3 flex flex-col gap-3">
              <div className="grid gap-3 md:grid-cols-3">
                <MiniStat
                  icon={ShieldCheck}
                  label="Data Lengkap"
                  value={`${polisQuality.dataLengkapPct}%`}
                  tone="positive"
                />
                <MiniStat
                  icon={AlertTriangle}
                  label="Data Kurang Lengkap"
                  value={`${polisQuality.dataKurangLengkapPct}%`}
                  tone="warning"
                />
                <MiniStat
                  icon={CircleDollarSign}
                  label="Butuh Validasi Income"
                  value={`${polisQuality.butuhValidasiIncomePct}%`}
                  tone="neutral"
                />
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-[#5B6B7F]">
                  <span>Distribusi Quality Data</span>
                  <span className="text-xs font-medium text-[#0B1E33]">
                    100% portofolio
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5EEFF]">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${polisQuality.dataLengkapPct}%` }}
                  />
                  <div
                    className="h-full -mt-3 bg-amber-400"
                    style={{
                      width: `${
                        polisQuality.dataLengkapPct +
                        polisQuality.dataKurangLengkapPct
                      }%`,
                    }}
                  />
                  <div
                    className="h-full -mt-3 bg-sky-500"
                    style={{
                      width: `${
                        polisQuality.dataLengkapPct +
                        polisQuality.dataKurangLengkapPct +
                        polisQuality.butuhValidasiIncomePct
                      }%`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-[#5B6B7F]">
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Data Lengkap</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                    <span>Kurang Lengkap</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
                    <span>Butuh Validasi Income</span>
                  </div>
                </div>
                <div className="h-20 overflow-hidden rounded-xl bg-[#F7FBFF] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={qualityChartData}
                      margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
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
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
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
                        formatter={(value: unknown) => {
                          const numeric = Number(value ?? 0);
                          return [`${numeric}%`, "Quality"];
                        }}
                        labelFormatter={(label) => `Kategori: ${label}`}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {qualityChartData.map((item) => (
                          <Cell key={item.label} fill={item.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      {modal}
    </>
  );
}
