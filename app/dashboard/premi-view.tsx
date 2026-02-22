import { useState } from "react";
import { ListOrdered } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import dashboardData from "@/data/dashboard-mock.json";

const premiKpi = dashboardData.premi.kpi;
const premiByProduct = dashboardData.premi.byProduct;
const premiByChannel = dashboardData.premi.byChannel;
const premiTarget = dashboardData.premi.targetRealization;
const premiTenor = dashboardData.premi.tenorProfile;
const premiPlafon = dashboardData.premi.plafonProfile;

const premiTrendData = [
  {
    label: "Hari ini",
    premiM: premiKpi.premiTodayM,
    targetPct: premiKpi.premiTodayVsAvgPct,
  },
  {
    label: "Bulan ini",
    premiM: premiKpi.premiMonthM,
    targetPct: premiKpi.premiMonthTargetPct,
  },
  {
    label: "Tahun berjalan",
    premiM: premiKpi.premiYtdM,
    targetPct: premiKpi.premiYtdTargetPct,
  },
];

const premiTargetChartData = [
  {
    label: "Tahun",
    value: premiTarget.yearPct,
  },
  {
    label: "Bulan",
    value: premiTarget.monthPct,
  },
];

export function PremiView({ isLoading }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<
    "trend" | "composition" | "target" | "profil" | null
  >(null);

  let modal = null;

  if (activeModal === "trend") {
    const headers = ["Periode", "Premi (M)", "Target / Rata-rata (%)"];
    const rows = premiTrendData.map((row) => [
      row.label,
      row.premiM,
      row.targetPct,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = premiTrendData.map((row) => ({
        periode: row.label,
        premiM: row.premiM,
        targetAtauRataRataPct: row.targetPct,
      }));
      downloadCsv("premi-trend-premi.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Trend Premi"
        description="Premi harian, bulanan, dan tahun berjalan beserta target/benchmark."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "composition") {
    const headers = ["Dimensi", "Label", "Share (%)", "Quality (%)"];
    const rows: (string | number)[][] = [
      ...premiByProduct.map((item) => [
        "Produk",
        item.label,
        item.sharePct,
        item.qualityPct,
      ]),
      ...premiByChannel.map((item) => [
        "Channel",
        item.label,
        item.sharePct,
        item.qualityPct,
      ]),
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        label: row[1],
        sharePct: row[2],
        qualityPct: row[3],
      }));
      downloadCsv("premi-kontribusi-produk-channel.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Kontribusi Produk & Channel"
        description="Komposisi premi per produk dan channel distribusi."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "target") {
    const headers = ["Periode", "Realisasi Target (%)"];
    const rows: (string | number)[][] = [
      ["Tahun Berjalan", premiTarget.yearPct],
      ["Bulan Berjalan", premiTarget.monthPct],
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        periode: row[0],
        realisasiTargetPct: row[1],
      }));
      downloadCsv("premi-realisasi-target.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Realisasi Target Premi"
        description="Realisasi target premi tahun dan bulan berjalan."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "profil") {
    const headers = ["Dimensi", "Bucket", "Share (%)", "Coverage (%)"];
    const rows: (string | number)[][] = [
      ...premiTenor.map((item) => [
        "Tenor Kredit",
        item.label,
        item.sharePct,
        item.coveragePct,
      ]),
      ...premiPlafon.map((item) => [
        "Plafon Kredit",
        item.label,
        item.sharePct,
        item.coveragePct,
      ]),
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        bucket: row[1],
        sharePct: row[2],
        coveragePct: row[3],
      }));
      downloadCsv("premi-profil-premi.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Profil Premi"
        description="Distribusi tenor dan plafon kredit terhadap premi."
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
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Trend Premi</CardTitle>
              <CardDescription>
                Premi harian, bulanan, dan tahun berjalan
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="soft">Gross written premium</Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("trend")}
              >
                <ListOrdered className="mr-1 h-3 w-3" />
                Detail & Export
              </Button>
            </div>
          </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="h-40 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={premiTrendData}
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
                      `Rp ${Number(value).toLocaleString("id-ID")} M`
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
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
                    formatter={(value: unknown, name: unknown) => {
                      const key = String(name ?? "");
                      const numeric = Number(value ?? 0);
                      if (key === "premiM") {
                        return [
                          `Rp ${numeric.toLocaleString("id-ID")} M`,
                          "Premi",
                        ];
                      }
                      if (key === "targetPct") {
                        return [`${numeric}%`, "Target / Rata-rata"];
                      }
                      return [value as string | number | undefined, key];
                    }}
                    labelFormatter={(label) => label}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="premiM"
                    radius={[8, 8, 0, 0]}
                    name="premiM"
                    fill="#3b82f6"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="targetPct"
                    stroke="#facc15"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="targetPct"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid gap-3 text-xs md:grid-cols-3">
            <KpiStat
              label="Premi Hari Ini"
              value={`Rp ${premiKpi.premiTodayM.toLocaleString("id-ID")} M`}
              helper={`+${premiKpi.premiTodayVsAvgPct}% vs rata-rata`}
              tone="positive"
            />
            <KpiStat
              label="Premi Bulan Ini"
              value={`Rp ${premiKpi.premiMonthM.toLocaleString("id-ID")} M`}
              helper={`${premiKpi.premiMonthTargetPct}% dari target`}
              tone="neutral"
            />
            <KpiStat
              label="Premi Tahun Berjalan"
              value={`Rp ${premiKpi.premiYtdM.toLocaleString("id-ID")} M`}
              helper={`${premiKpi.premiYtdTargetPct}% dari target tahunan`}
              tone="neutral"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Kontribusi Produk & Channel</CardTitle>
            <CardDescription>Komposisi premi utama</CardDescription>
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
        <CardContent className="grid flex-1 gap-4 md:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <BarListPlaceholder
                title="Per Produk"
                items={premiByProduct.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.qualityPct,
                }))}
              />
              <BarListPlaceholder
                title="Per Channel"
                items={premiByChannel.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.qualityPct,
                }))}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Realisasi Target</CardTitle>
            <CardDescription>Monitoring pencapaian target premi</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("target")}
          >
            <ListOrdered className="mr-1 h-3 w-3" />
            Detail & Export
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6B7F]">Tahun Berjalan</span>
                  <span className="font-medium text-[#0B1E33]">
                    {premiTarget.yearPct}%
                  </span>
                </div>
                <Progress value={premiTarget.yearPct} />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5B6B7F]">Bulan Berjalan</span>
                  <span className="font-medium text-[#0B1E33]">
                    {premiTarget.monthPct}%
                  </span>
                </div>
                <Progress value={premiTarget.monthPct} />
              </div>
              <div className="rounded-xl bg-[#F7FBFF] p-3 text-xs text-[#5B6B7F]">
                <p className="font-medium text-[#0B1E33]">
                  Fokus cross-sell polis tambahan untuk nasabah existing.
                </p>
              </div>
              <div className="h-24 overflow-hidden rounded-xl bg-[#F7FBFF] p-3 text-xs">
                <p className="mb-2 font-medium text-[#0B1E33]">
                  Perbandingan Target Tahun vs Bulan
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={premiTargetChartData}
                    margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
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
                        return [`${numeric}%`, "Realisasi"];
                      }}
                      labelFormatter={(label) => `Periode: ${label}`}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {premiTargetChartData.map((item) => (
                        <Cell key={item.label} fill="#3b82f6" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-7">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Profil Premi</CardTitle>
            <CardDescription>Distribusi tenor dan plafon kredit</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("profil")}
          >
            <ListOrdered className="mr-1 h-3 w-3" />
            Detail & Export
          </Button>
        </CardHeader>
        <CardContent className="grid flex-1 gap-4 md:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <BarListPlaceholder
                title="Tenor Kredit"
                items={premiTenor.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.coveragePct,
                }))}
              />
              <BarListPlaceholder
                title="Plafon Kredit"
                items={premiPlafon.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.coveragePct,
                }))}
              />
            </>
          )}
        </CardContent>
      </Card>
      </div>
      {modal}
    </>
  );
}
