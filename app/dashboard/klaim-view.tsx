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
  AgingRow,
  BarListPlaceholder,
  CommonViewProps,
  KpiStat,
  DataModal,
  downloadCsv,
  type CsvRow,
} from "./common";
import dashboardData from "@/data/dashboard-mock.json";

const klaimKpi = dashboardData.klaim.kpi;
const klaimRatioByProduct = dashboardData.klaim.claimRatioByProduct;
const klaimRatioByRegion = dashboardData.klaim.claimRatioByRegion;
const klaimAging = dashboardData.klaim.aging;
const klaimCompositionByCause = dashboardData.klaim.compositionByCause;
const klaimCompositionByCoverageType =
  dashboardData.klaim.compositionByCoverageType;

const klaimTrendData = [
  {
    label: "Klaim Diajukan",
    value: klaimKpi.submitted,
    approvalRatePct: klaimKpi.approvalRatePct,
  },
  {
    label: "Klaim Disetujui",
    value: klaimKpi.approved,
    approvalRatePct: klaimKpi.approvalRatePct,
  },
  {
    label: "Klaim Ditolak",
    value: klaimKpi.rejected,
    approvalRatePct: 100 - klaimKpi.approvalRatePct,
  },
];

const klaimAgingChartData = klaimAging.map((item) => ({
  label: item.label,
  value: item.valuePct,
}));

export function KlaimView({ isLoading }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<
    "trend" | "ratio" | "aging" | "composition" | null
  >(null);

  let modal = null;

  if (activeModal === "trend") {
    const headers = ["Status", "Jumlah Klaim", "Approval / Penolakan (%)"];
    const rows = klaimTrendData.map((row) => [
      row.label,
      row.value,
      row.approvalRatePct,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = klaimTrendData.map((row) => ({
        status: row.label,
        jumlahKlaim: row.value,
        approvalAtauPenolakanPct: row.approvalRatePct,
      }));
      downloadCsv("klaim-trend-klaim.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Trend Klaim"
        description="Rincian klaim diajukan, disetujui, dan ditolak beserta rate-nya."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "ratio") {
    const headers = ["Dimensi", "Label", "Claim Ratio (%)"];
    const rows: (string | number)[][] = [
      ...klaimRatioByProduct.map((item) => [
        "Produk",
        item.label,
        item.ratioPct,
      ]),
      ...klaimRatioByRegion.map((item) => [
        "Region",
        item.label,
        item.ratioPct,
      ]),
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        label: row[1],
        claimRatioPct: row[2],
      }));
      downloadCsv("klaim-claim-ratio.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Claim Ratio"
        description="Claim ratio per produk dan region utama."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "aging") {
    const headers = ["Bucket Aging", "Porsi Klaim (%)"];
    const rows: (string | number)[][] = klaimAging.map((item) => [
      item.label,
      item.valuePct,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        bucketAging: row[0],
        porsiKlaimPct: row[1],
      }));
      downloadCsv("klaim-aging-klaim.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Aging Klaim"
        description="Distribusi klaim per bucket hari."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "composition") {
    const headers = ["Dimensi", "Label", "Share (%)"];
    const rows: (string | number)[][] = [
      ...klaimCompositionByCause.map((item) => [
        "Penyebab",
        item.label,
        item.sharePct,
      ]),
      ...klaimCompositionByCoverageType.map((item) => [
        "Jenis Pertanggungan",
        item.label,
        item.sharePct,
      ]),
    ];
    const handleExport = () => {
      const csvRows: CsvRow[] = rows.map((row) => ({
        dimensi: row[0],
        label: row[1],
        sharePct: row[2],
      }));
      downloadCsv("klaim-komposisi-klaim.csv", csvRows);
    };

    modal = (
      <DataModal
        title="Detail Komposisi Klaim"
        description="Komposisi klaim per penyebab dan jenis pertanggungan."
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
        <Card className="flex flex-col lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Trend Klaim</CardTitle>
              <CardDescription>
                Klaim diajukan, disetujui, dan dibayar
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="soft">
                Claim ratio {klaimKpi.claimRatioPct}%
              </Badge>
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
                  data={klaimTrendData}
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
                      if (key === "value") {
                        return [
                          numeric.toLocaleString("id-ID"),
                          "Jumlah klaim",
                        ];
                      }
                      if (key === "approvalRatePct") {
                        return [`${numeric}%`, "Approval / Penolakan"];
                      }
                      return [value as string | number | undefined, key];
                    }}
                    labelFormatter={(label) => label}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    name="value"
                    fill="#3b82f6"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="approvalRatePct"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="approvalRatePct"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid gap-3 text-xs md:grid-cols-3">
            <KpiStat
              label="Klaim Diajukan"
              value={klaimKpi.submitted.toLocaleString("id-ID")}
              helper="Stabil vs bulan lalu"
              tone="neutral"
            />
            <KpiStat
              label="Klaim Disetujui"
              value={klaimKpi.approved.toLocaleString("id-ID")}
              helper={`Approval rate ${klaimKpi.approvalRatePct}%`}
              tone="positive"
            />
            <KpiStat
              label="Klaim Ditolak"
              value={klaimKpi.rejected.toLocaleString("id-ID")}
              helper="Pantau root cause"
              tone="warning"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Claim Ratio</CardTitle>
            <CardDescription>Per produk dan region utama</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("ratio")}
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
                items={klaimRatioByProduct.map((item) => ({
                  label: item.label,
                  primary: item.ratioPct,
                  secondary: item.ratioPct,
                }))}
              />
              <BarListPlaceholder
                title="Per Region"
                items={klaimRatioByRegion.map((item) => ({
                  label: item.label,
                  primary: item.ratioPct,
                  secondary: item.ratioPct,
                }))}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col lg:col-span-5">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Aging Klaim</CardTitle>
            <CardDescription>Distribusi klaim per bucket hari</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveModal("aging")}
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
              <div className="space-y-3 text-xs">
                {klaimAging.map((item) => (
                  <AgingRow
                    key={item.label}
                    label={item.label}
                    value={item.valuePct}
                    tone={
                      item.label === "0-30 Hari"
                        ? "positive"
                        : item.label === "31-60 Hari"
                        ? "warning"
                        : "negative"
                    }
                  />
                ))}
              </div>
              <div className="rounded-xl bg-[#F7FBFF] p-3 text-xs text-[#5B6B7F]">
                <p className="font-medium text-[#0B1E33]">
                  Percepat penyelesaian klaim di bucket 31-60 dan 60+ hari.
                </p>
              </div>
              <div className="h-28 overflow-hidden rounded-xl bg-[#F7FBFF] p-3 text-xs">
                <p className="mb-2 font-medium text-[#0B1E33]">
                  Distribusi Aging (%)
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={klaimAgingChartData}
                    layout="vertical"
                    margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#e5edff"
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
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
                        return [`${numeric}%`, "Porsi klaim"];
                      }}
                      labelFormatter={(label) => `Bucket: ${label}`}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {klaimAgingChartData.map((item) => (
                        <Cell key={item.label} fill="#0ea5e9" />
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
            <CardTitle>Komposisi Klaim</CardTitle>
            <CardDescription>Per penyebab dan jenis pertanggungan</CardDescription>
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
                title="Penyebab Klaim"
                items={klaimCompositionByCause.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.sharePct,
                }))}
              />
              <BarListPlaceholder
                title="Jenis Pertanggungan"
                items={klaimCompositionByCoverageType.map((item) => ({
                  label: item.label,
                  primary: item.sharePct,
                  secondary: item.sharePct,
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
