import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Layers,
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

type OverviewModalType = "trend" | "breakdown" | "risk" | null;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

export function OverviewView({ isLoading, data }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<OverviewModalType>(null);
  
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

  // Handle Modal Logic
  let modal = null;
  if (activeModal === "trend") {
    const headers = ["Tanggal", "Pagu (Rp)", "HPS (Rp)", "Paket", "Efisiensi (%)"];
    const rows = trendData.map((row) => [
      row.label,
      row.paguM,
      row.hpsM,
      row.count,
      row.efficiency.toFixed(2),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = trendData.map((row) => ({
        tanggal: row.label,
        pagu: row.paguM,
        hps: row.hpsM,
        jumlahPaket: row.count,
        efisiensiPct: row.efficiency,
      }));
      downloadCsv("overview-trend.csv", csvRows);
    };
    modal = (
      <DataModal
        title="Detail Trend Harian"
        description="Data harian Pagu, HPS, dan Efisiensi."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  } else if (activeModal === "breakdown") {
    const headers = ["Unit Kerja", "Pagu (Rp)", "Jumlah Paket", "Share (%)"];
    const rows = stats.byUnitKerja.map((item) => [
      item.name,
      item.pagu,
      item.count,
      item.share.toFixed(2),
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = stats.byUnitKerja.map((item) => ({
        unitKerja: item.name,
        pagu: item.pagu,
        jumlahPaket: item.count,
        share: item.share,
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
  } else if (activeModal === "risk") { // Top Projects
    const headers = ["Nama Paket", "Unit Kerja", "Pagu (Rp)", "HPS (Rp)"];
    const rows = stats.topProjects.map((item) => [
      item.name,
      item.unit,
      item.pagu,
      item.hps,
    ]);
    const handleExport = () => {
      const csvRows: CsvRow[] = stats.topProjects.map((item) => ({
        namaPaket: item.name,
        unit: item.unit,
        pagu: item.pagu,
        hps: item.hps,
      }));
      downloadCsv("overview-top-projects.csv", csvRows);
    };
    modal = (
      <DataModal
        title="Top 5 Paket Terbesar"
        description="Paket dengan nilai Pagu tertinggi."
        headers={headers}
        rows={rows}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
        exportLabel="Export CSV"
      />
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(val);
  };

  const formatLargeCurrency = (val: number) => {
     return `Rp ${(val / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  }

  return (
    <div className="flex flex-col gap-4 h-full lg:h-[calc(100vh-180px)] w-full">
      {/* 1. KPI Cards Row (Fixed Height on Desktop) */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card className="shadow-sm flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Pagu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-xl lg:text-2xl font-bold">{formatLargeCurrency(stats.totalPagu)}</div>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  Dari {stats.totalPackages} paket terdaftar
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total HPS
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-xl lg:text-2xl font-bold">{formatLargeCurrency(stats.totalHps)}</div>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-emerald-600 font-medium mr-1">
                    {(stats.totalPagu > 0 ? (stats.totalHps/stats.totalPagu)*100 : 0).toFixed(1)}%
                  </span>
                  rasio terhadap Pagu
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Hemat
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
             {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-xl lg:text-2xl font-bold text-emerald-600">{formatLargeCurrency(stats.totalSavings)}</div>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  {stats.savingsPercentage.toFixed(1)}% efisiensi anggaran
                </p>
              </>
             )}
          </CardContent>
        </Card>

        <Card className="shadow-sm flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Metode Top
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
             {isLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-lg lg:text-xl font-bold truncate" title={stats.byMethod[0]?.name}>
                  {stats.byMethod[0]?.name || "-"}
                </div>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  {stats.byMethod[0]?.count || 0} paket ({stats.byMethod[0]?.share.toFixed(1)}% share)
                </p>
              </>
             )}
          </CardContent>
        </Card>
      </div>

      {/* 2. Main Grid Layout (Flexible Height) */}
      <div className="flex-1 grid gap-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 min-h-0">
        
        {/* Top Left: Trend Chart (2 cols) */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Trend Realisasi Anggaran</CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("trend")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                      if (name === "Efisiensi") return [`${Number(value).toFixed(2)}%`, name];
                      return [`Rp ${Number(value).toLocaleString('id-ID')}`, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="paguM" 
                    name="Pagu" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorPagu)" 
                    strokeWidth={2}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="hpsM" 
                    name="HPS" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    barSize={12} 
                    fillOpacity={0.8}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="efficiency" 
                    name="Efisiensi" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Right: Method Pie (1 col) */}
        <Card className="lg:col-span-1 shadow-sm flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Metode Pengadaan</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2 relative flex flex-col items-center justify-center">
              {isLoading ? <Skeleton className="h-full w-full rounded-full" /> : (
                <>
                  <div className="w-full h-[60%]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.byMethod}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="pagu"
                          >
                            {stats.byMethod.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             formatter={(value: any) => formatCurrency(value)}
                             contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="w-full h-[40%] text-[10px] space-y-1 overflow-y-auto px-2 custom-scrollbar">
                      {stats.byMethod.slice(0, 4).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1 last:border-0">
                           <div className="flex items-center gap-1.5 truncate max-w-[120px]" title={entry.name}>
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                              <span className="truncate">{entry.name}</span>
                           </div>
                           <span className="font-medium text-gray-600">{entry.share.toFixed(0)}%</span>
                        </div>
                      ))}
                   </div>
                </>
              )}
          </CardContent>
        </Card>

        {/* Bottom Left: Top Projects (2 cols) */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0 bg-white z-10">
             <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Top 5 Paket Terbesar</CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("risk")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-muted/20 text-muted-foreground font-medium z-10">
                  <tr>
                    <th className="px-3 py-2 font-medium w-[40%]">Nama Paket</th>
                    <th className="px-3 py-2 font-medium w-[20%]">Unit</th>
                    <th className="px-3 py-2 font-medium text-right w-[20%]">Pagu</th>
                    <th className="px-3 py-2 font-medium text-right w-[20%]">Efisiensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.topProjects.map((project, idx) => {
                     const efficiency = project.pagu > 0 ? ((project.pagu - project.hps) / project.pagu) * 100 : 0;
                     return (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 align-top">
                          <div className="line-clamp-2 font-medium text-gray-700" title={project.name}>
                            {project.name}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top text-gray-500">
                          <div className="line-clamp-1" title={project.unit}>{project.unit}</div>
                        </td>
                        <td className="px-3 py-2 align-top text-right font-medium text-gray-700">
                          {formatLargeCurrency(project.pagu)}
                        </td>
                        <td className="px-3 py-2 align-top text-right">
                          <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${efficiency > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {efficiency.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Bottom Right: Unit Bar (1 col) */}
        <Card className="lg:col-span-1 shadow-sm flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b h-[45px] shrink-0">
             <div className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Top Unit Kerja</CardTitle>
             </div>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActiveModal("breakdown")}>
                <ArrowUpRight className="h-3 w-3" />
             </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-2">
             {isLoading ? <Skeleton className="h-full w-full" /> : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                    layout="vertical"
                    data={stats.byUnitKerja.slice(0, 5)}
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
                     formatter={(val: any) => formatCurrency(val)}
                   />
                   <Bar dataKey="pagu" radius={[0, 4, 4, 0]}>
                     {stats.byUnitKerja.slice(0, 5).map((_, index) => (
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
