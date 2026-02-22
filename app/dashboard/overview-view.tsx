import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ListOrdered,
  Percent,
  ShieldCheck,
  Users,
} from "lucide-react";
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
  DonutPlaceholder,
  KpiStat,
  MiniStat,
  AgingRow,
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import dashboardData from "@/data/dashboard-mock.json";

const trendData = dashboardData.overview.trendOutstanding;
const overviewKpi = dashboardData.overview;
const firstTrendPoint = trendData[0];
const lastTrendPoint = trendData[trendData.length - 1];
const lastCoverage = lastTrendPoint?.coverage ?? 0;

const premiClaimChartData = [
  {
    label: "Premi YTD",
    value: overviewKpi.premiAndClaim.premiYtdM,
    color: "#3b82f6",
  },
  {
    label: "Klaim Dibayar",
    value: overviewKpi.premiAndClaim.claimPaidM,
    color: "#ef4444",
  },
];

type OverviewModalType = "trend" | "snapshot" | "breakdown" | "risk" | null;

export function OverviewView({ isLoading }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<OverviewModalType>(null);

  let modal: ReactNode | null = null;

  if (activeModal === "trend") {
    const headers = [
      "Hari",
      "Outstanding (M)",
      "Tercover (M)",
      "Kredit Baru (M)",
      "Coverage (%)",
    ];
    const rows = trendData.map((row) => [
      row.label,
      row.outstandingM,
      row.coveredM,
      row.newCreditM,
      row.coverage,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = trendData.map((row) => ({
        hari: row.label,
        outstandingM: row.outstandingM,
        coveredM: row.coveredM,
        newCreditM: row.newCreditM,
        coveragePct: row.coverage,
      }));
      downloadCsv("overview-trend-kredit.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Trend Outstanding & Coverage"
        description="Data harian outstanding kredit, tercover, dan kredit baru."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "snapshot") {
    const headers = ["Kategori", "Sub-Kategori", "Nilai"];
    const rows: (string | number)[][] = [
      [
        "Snapshot",
        "Polis Aktif",
        overviewKpi.snapshot.policiesActive,
      ],
      [
        "Snapshot",
        "Debitur Aktif",
        overviewKpi.snapshot.debiturActive,
      ],
      [
        "Snapshot",
        "Pending Polis",
        overviewKpi.snapshot.pendingPolis,
      ],
      [
        "Snapshot",
        "Rasio Polis vs Kredit (%)",
        overviewKpi.snapshot.ratioPolisVsKreditPct,
      ],
      [
        "Aktivitas Polis",
        "Polis Aktif",
        overviewKpi.activePolicies.aktif,
      ],
      [
        "Aktivitas Polis",
        "Polis Baru Bulan Ini",
        overviewKpi.activePolicies.baruBulanIni,
      ],
      [
        "Aktivitas Polis",
        "Jatuh Tempo 30 Hari",
        overviewKpi.activePolicies.jatuhTempo30Hari,
      ],
      [
        "Premi & Klaim",
        "Premi YTD (M)",
        overviewKpi.premiAndClaim.premiYtdM,
      ],
      [
        "Premi & Klaim",
        "Target Premi YTD (%)",
        overviewKpi.premiAndClaim.premiTargetPct,
      ],
      [
        "Premi & Klaim",
        "Klaim Dibayar (M)",
        overviewKpi.premiAndClaim.claimPaidM,
      ],
      [
        "Premi & Klaim",
        "Claim Ratio (%)",
        overviewKpi.premiAndClaim.claimRatioPct,
      ],
    ];

    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        kategori: row[0],
        subKategori: row[1],
        nilai: row[2],
      }));
      downloadCsv("overview-snapshot-portofolio.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Snapshot Portofolio"
        description="Ringkasan posisi polis, debitur, dan premi hari ini."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "breakdown") {
    const headers = [
      "Dimensi",
      "Label",
      "Share Outstanding (%)",
      "Coverage (%)",
    ];
    const rows: (string | number)[][] = [
      ...overviewKpi.breakdownByProduct.map((item) => [
        "Produk",
        item.label,
        item.outstandingPct,
        item.coveragePct,
      ]),
      ...overviewKpi.breakdownByRegion.map((item) => [
        "Region",
        item.label,
        item.outstandingPct,
        item.coveragePct,
      ]),
    ];

    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        label: row[1],
        outstandingPct: row[2],
        coveragePct: row[3],
      }));
      downloadCsv("overview-breakdown-outstanding.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Breakdown Outstanding"
        description="Share outstanding dan coverage per produk dan region."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "risk") {
    const headers = ["Jenis", "Bucket/Segmen", "Nilai (%)"];
    const rows: (string | number)[][] = [
      ...overviewKpi.risk.kolektibilitas.map((row) => [
        "Kolektibilitas",
        row.label,
        row.valuePct,
      ]),
      ...overviewKpi.risk.coverageSegment.map((row) => [
        "Coverage Segmen",
        row.label,
        row.valuePct,
      ]),
    ];

    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        jenis: row[0],
        label: row[1],
        nilaiPct: row[2],
      }));
      downloadCsv("overview-risiko-dan-coverage.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Profil Risiko & Coverage"
        description="Distribusi kolektibilitas dan coverage per segmen."
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
              <CardTitle>Total Kredit vs Coverage</CardTitle>
              <CardDescription>
                Outstanding kredit konsumtif dan yang tercover asuransi
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
          <div className="grid gap-3 md:grid-cols-4">
            <KpiStat
              label="Total Outstanding Kredit"
              value={`Rp ${(
                trendData[trendData.length - 1]?.outstandingM ?? 0
              ).toLocaleString("id-ID")} M`}
              helper={`+${overviewKpi.portfolioKpi.growthVsYesterdayPct}% vs kemarin`}
              tone="positive"
            />
            <KpiStat
              label="Tercover Asuransi"
              value={`Rp ${(
                trendData[trendData.length - 1]?.coveredM ?? 0
              ).toLocaleString("id-ID")} M`}
              helper={`${lastCoverage.toFixed(1)}% dari portofolio`}
              tone="neutral"
            />
            <KpiStat
              label="Belum Tercover"
              value={`Rp ${
                (
                  (trendData[trendData.length - 1]?.outstandingM ?? 0) -
                  (trendData[trendData.length - 1]?.coveredM ?? 0)
                ).toLocaleString("id-ID")
              } M`}
              helper={`${(100 - lastCoverage).toFixed(1)}% belum tercover`}
              tone="negative"
            />
            <KpiStat
              label="Rasio Kredit Baru"
              value={`${overviewKpi.portfolioKpi.newCreditRatioPct}%`}
              helper="Kredit baru vs existing"
              tone="neutral"
            />
          </div>
          {isLoading ? (
            <Skeleton className="mt-1 h-28 w-full" />
          ) : (
            <div className="grid flex-1 gap-3 md:grid-cols-[2.1fr_1.2fr]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-[#5B6B7F]">
                  <span>Trend Outstanding, Coverage & Kredit Baru (7 hari)</span>
                  <span>
                    {`Rp ${Number(
                      firstTrendPoint?.outstandingM ?? 0
                    ).toLocaleString("id-ID")} M → Rp ${Number(
                      lastTrendPoint?.outstandingM ?? 0
                    ).toLocaleString("id-ID")} M`}
                  </span>
                </div>
                <div className="h-40 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
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
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                          `${Number(value / 1000).toLocaleString("id-ID")} M`
                        }
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}%`}
                        domain={[80, 100]}
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
                          if (key === "outstandingM") {
                            const numeric = Number(value ?? 0);
                            return [
                              `Rp ${numeric.toLocaleString("id-ID")} M`,
                              "Outstanding",
                            ];
                          }
                          if (key === "coveredM") {
                            const numeric = Number(value ?? 0);
                            return [
                              `Rp ${numeric.toLocaleString("id-ID")} M`,
                              "Tercover",
                            ];
                          }
                          if (key === "coverage") {
                            const numeric = Number(value ?? 0);
                            return [`${numeric.toFixed(1)}%`, "Coverage"];
                          }
                          return [value as string | number | undefined, key];
                        }}
                        labelFormatter={(label) => `Hari: ${label}`}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="outstandingM"
                        radius={[8, 8, 0, 0]}
                        name="outstandingM"
                        fill="#3b82f6"
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="coveredM"
                        radius={[8, 8, 0, 0]}
                        name="coveredM"
                        fill="#22c55e"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="coverage"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="coverage"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl bg-[#F7FBFF] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#5B6B7F]">Coverage Ratio</p>
                    <p className="text-2xl font-semibold text-[#0B1E33]">
                      {lastCoverage.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-[#5B6B7F]">
                      Target harian 85% tercapai
                    </p>
                  </div>
                  <DonutPlaceholder value={lastCoverage} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-1">
                    <p className="text-[#5B6B7F]">Rata-rata Kredit / Debitur</p>
                    <p className="text-sm font-semibold text-[#0B1E33]">
                      Rp 210 Jt
                    </p>
                    <p className="text-[11px] text-emerald-600">
                      Selaras dengan plafon target
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#5B6B7F]">Tenor Dominan</p>
                    <p className="text-sm font-semibold text-[#0B1E33]">
                      5–10 tahun
                    </p>
                    <p className="text-[11px] text-[#5B6B7F]">
                      Mayoritas KPR & Multiguna
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

        <Card className="flex flex-col lg:col-span-4 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Snapshot Portofolio</CardTitle>
              <CardDescription>Status polis dan operasional hari ini</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("snapshot")}
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
              <div className="grid grid-cols-2 gap-3 text-xs">
                <MiniStat
                  icon={ShieldCheck}
                  label="Polis Aktif"
                  value={overviewKpi.snapshot.policiesActive.toLocaleString("id-ID")}
                  tone="positive"
                />
                <MiniStat
                  icon={Users}
                  label="Debitur Aktif"
                  value={overviewKpi.snapshot.debiturActive.toLocaleString("id-ID")}
                  tone="neutral"
                />
                <MiniStat
                  icon={AlertTriangle}
                  label="Pending Polis"
                  value={overviewKpi.snapshot.pendingPolis.toLocaleString("id-ID")}
                  tone="warning"
                />
                <MiniStat
                  icon={Percent}
                  label="Rasio Polis vs Kredit"
                  value={`${overviewKpi.snapshot.ratioPolisVsKreditPct}%`}
                  tone="positive"
                />
              </div>
              <div className="grid gap-3 text-[11px] md:grid-cols-[1.6fr_1.4fr]">
                <div className="rounded-xl bg-[#F7FBFF] p-3 text-[#5B6B7F]">
                  <p className="font-medium text-[#0B1E33]">
                    Fokus Hari Ini: Pelunasan & Restrukturisasi
                  </p>
                  <p className="mt-1">
                    Pastikan update pelunasan dipercepat dan restrukturisasi sudah
                    terkirim ke broker untuk penyesuaian polis.
                  </p>
                </div>
                <div className="h-24 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
                  <p className="mb-2 font-medium text-[#0B1E33]">
                    Premi vs Klaim (YTD)
                  </p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={premiClaimChartData}
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
                        tickFormatter={(value) =>
                          `Rp ${Number(value).toLocaleString("id-ID")} M`
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
                            `Rp ${numeric.toLocaleString("id-ID")} M`,
                            "Nilai",
                          ];
                        }}
                        labelFormatter={(label) => `Kategori: ${label}`}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {premiClaimChartData.map((item) => (
                          <Cell key={item.label} fill={item.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

        <Card className="flex flex-col lg:col-span-7 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Breakdown Outstanding</CardTitle>
              <CardDescription>Per jenis produk dan region utama</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("breakdown")}
            >
              <ListOrdered className="mr-1 h-3 w-3" />
              Detail & Export
            </Button>
          </CardHeader>
        <CardContent className="grid flex-1 grid-rows-[auto_1fr] gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <BarListPlaceholder
                  title="Per Jenis Produk"
                  items={overviewKpi.breakdownByProduct.map((item) => ({
                    label: item.label,
                    primary: item.outstandingPct,
                    secondary: item.coveragePct,
                  }))}
                />
                <BarListPlaceholder
                  title="Per Cabang / Region"
                  items={overviewKpi.breakdownByRegion.map((item) => ({
                    label: item.label,
                    primary: item.outstandingPct,
                    secondary: item.coveragePct,
                  }))}
                />
              </div>
              <div className="h-24 overflow-hidden rounded-xl bg-[#F7FBFF] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={overviewKpi.breakdownByProduct}
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
                        if (key === "outstandingPct") {
                          return [`${numeric}%`, "Share Outstanding"];
                        }
                        if (key === "coveragePct") {
                          return [`${numeric}%`, "Coverage"];
                        }
                        return [value as string | number | undefined, key];
                      }}
                      labelFormatter={(label) => `Produk: ${label}`}
                    />
                    <Bar dataKey="outstandingPct" radius={[8, 8, 0, 0]}>
                      {overviewKpi.breakdownByProduct.map((item) => (
                        <Cell key={item.label} fill="#3b82f6" />
                      ))}
                    </Bar>
                    <Bar dataKey="coveragePct" radius={[8, 8, 0, 0]}>
                      {overviewKpi.breakdownByProduct.map((item) => (
                        <Cell key={item.label} fill="#22c55e" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

        <Card className="flex flex-col lg:col-span-5 lg:row-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle>Profil Risiko & Coverage</CardTitle>
              <CardDescription>Kolektibilitas dan coverage per kelas risiko</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("risk")}
            >
              <ListOrdered className="mr-1 h-3 w-3" />
              Detail & Export
            </Button>
          </CardHeader>
        <CardContent className="grid flex-1 grid-cols-2 gap-3 text-[11px]">
          {isLoading ? (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F]">
                  Kolektibilitas Portofolio
                </p>
                {overviewKpi.risk.kolektibilitas.map((row) => (
                  <AgingRow
                    key={row.label}
                    label={row.label}
                    value={row.valuePct}
                    tone={
                      row.label.includes("Lancar")
                        ? "positive"
                        : row.label.includes("3+")
                        ? "negative"
                        : "warning"
                    }
                  />
                ))}
                <div className="h-20 overflow-hidden rounded-xl bg-[#F7FBFF] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overviewKpi.risk.kolektibilitas}
                      layout="vertical"
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#e5edff"
                        strokeDasharray="3 3"
                        horizontal={false}
                      />
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        width={80}
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
                          return [`${numeric}%`, "Porsi Outstanding"];
                        }}
                        labelFormatter={(label) => `Bucket: ${label}`}
                      />
                      <Bar dataKey="valuePct" radius={[0, 8, 8, 0]}>
                        {overviewKpi.risk.kolektibilitas.map((row) => (
                          <Cell
                            key={row.label}
                            fill={
                              row.label.includes("Lancar")
                                ? "#22c55e"
                                : row.label.includes("3+")
                                ? "#ef4444"
                                : "#f97316"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F]">
                  Coverage per Segmen
                </p>
                {overviewKpi.risk.coverageSegment.map((row) => (
                  <AgingRow
                    key={row.label}
                    label={row.label}
                    value={row.valuePct}
                    tone={row.label === "Payroll" ? "positive" : "neutral"}
                  />
                ))}
                <div className="h-20 overflow-hidden rounded-xl bg-[#F7FBFF] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overviewKpi.risk.coverageSegment}
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
                        domain={[60, 100]}
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
                          return [`${numeric}%`, "Coverage"];
                        }}
                        labelFormatter={(label) => `Segmen: ${label}`}
                      />
                      <Bar dataKey="valuePct" radius={[8, 8, 0, 0]}>
                        {overviewKpi.risk.coverageSegment.map((row) => (
                          <Cell
                            key={row.label}
                            fill={
                              row.label === "Payroll"
                                ? "#22c55e"
                                : row.label === "Retail"
                                ? "#3b82f6"
                                : "#0ea5e9"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </CardContent>
        </Card>
      </div>
      {modal}
    </>
  );
}
