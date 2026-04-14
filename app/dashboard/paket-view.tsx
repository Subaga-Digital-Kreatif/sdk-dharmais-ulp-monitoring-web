import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  Filter,
  PieChart as PieChartIcon,
  BarChart3,
  List,
  MoreHorizontal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bar,
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
import { getPersiapanSummary, type PersiapanSummaryResponse } from "@/models/persiapan-summary";

type PaketModalType = "trend" | "range" | null;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

export function PaketView({ isLoading, data }: CommonViewProps) {
  const [activeModal, setActiveModal] = useState<PaketModalType>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedView, setSelectedView] = useState<"split" | "table" | "charts">("split");
  const [summary, setSummary] = useState<PersiapanSummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const stats = useMemo(() => calculateUlpStats(data), [data]);

  useEffect(() => {
    let cancelled = false;
    getPersiapanSummary()
      .then((res: any) => {
        const normalized =
          res && typeof res === "object" && "data" in res ? res.data : res;
        if (!cancelled) setSummary(normalized as PersiapanSummaryResponse);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaket = summary?.totalPaket ?? stats.totalPackages;
  const totalPagu = summary?.totalPagu ?? stats.totalPagu;
  const totalHps = summary?.totalHps ?? stats.totalHps;
  const avgPaket = totalPaket > 0 ? totalPagu / totalPaket : 0;
  const kpiLoading = isLoading || summaryLoading;

  // Monthly Trend Calculation
  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { date: Date, count: number, pagu: number }>();
    data.forEach(item => {
      if (!item.tanggalDpp) return;
      const key = item.tanggalDpp.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      const current = map.get(key) || { date: item.tanggalDpp, count: 0, pagu: 0 };
      current.count += 1;
      current.pagu += item.paguAnggaranAktif || 0;
      map.set(key, current);
    });
    
    return Array.from(map.entries())
      .map(([label, val]) => ({
        label,
        date: val.date,
        count: val.count,
        pagu: val.pagu,
        avgPagu: val.count > 0 ? val.pagu / val.count : 0
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  // Price Range Distribution
  const priceRanges = useMemo(() => {
    const ranges = [
      { name: "< 200 Juta", min: 0, max: 200_000_000, count: 0, pagu: 0 },
      { name: "200 Juta - 2.5 M", min: 200_000_000, max: 2_500_000_000, count: 0, pagu: 0 },
      { name: "2.5 M - 50 M", min: 2_500_000_000, max: 50_000_000_000, count: 0, pagu: 0 },
      { name: "> 50 M", min: 50_000_000_000, max: Infinity, count: 0, pagu: 0 },
    ];

    data.forEach(item => {
      const val = item.paguAnggaranAktif || 0;
      const range = ranges.find(r => val >= r.min && val < r.max);
      if (range) {
        range.count++;
        range.pagu += val;
      }
    });

    return ranges.filter(r => r.count > 0);
  }, [data]);

  // Filtered & Sorted List
  const filteredPackages = useMemo(() => {
    let result = [...data];
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.namaPaketPbj || "").toLowerCase().includes(lower) ||
        (item.unitKerja || "").toLowerCase().includes(lower) ||
        (item.noAgenda || "").toLowerCase().includes(lower)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any = a[sortConfig.key as keyof typeof a];
        let valB: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === 'pagu') {
           valA = a.paguAnggaranAktif || 0;
           valB = b.paguAnggaranAktif || 0;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date desc
      result.sort((a, b) => (b.tanggalDpp?.getTime() || 0) - (a.tanggalDpp?.getTime() || 0));
    }

    return result.slice(0, 100); // Limit for performance in scroll view
  }, [data, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(val);
  };

  const toFiniteNumber = (val: unknown, fallback = 0): number => {
    if (typeof val === "number") return Number.isFinite(val) ? val : fallback;
    if (typeof val === "string") {
      const cleaned = val.replace(/[^\d.,-]/g, "");
      if (!cleaned) return fallback;
      const normalized = cleaned.includes(".") && cleaned.includes(",")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.includes(".") && cleaned.split(".").length > 2
        ? cleaned.replace(/\./g, "")
        : cleaned.includes(",") && cleaned.split(",").length > 2
        ? cleaned.replace(/,/g, "")
        : cleaned.replace(",", ".");
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  const formatLargeCurrency = (val: unknown) => {
    const safe = toFiniteNumber(val, 0);
    return `Rp ${(safe / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  };

  // Modals
  let modal = null;
  if (activeModal === "trend") {
    const headers = ["Bulan", "Jumlah Paket", "Total Pagu (Rp)", "Rata-rata (Rp)"];
    const rows = monthlyTrend.map(row => [
      row.label,
      row.count,
      row.pagu,
      row.avgPagu.toFixed(0)
    ]);
    const handleExport = () => {
       const csvRows: CsvRow[] = monthlyTrend.map(row => ({
          bulan: row.label,
          jumlah: row.count,
          pagu: row.pagu,
          rataRata: row.avgPagu
       }));
       downloadCsv("paket-trend-bulanan.csv", csvRows);
    };
    modal = (
       <DataModal 
          title="Trend Bulanan" 
          description="Statistik paket per bulan" 
          headers={headers} 
          rows={rows} 
          onClose={() => setActiveModal(null)} 
          onExport={handleExport}
          exportLabel="Export CSV"
       />
    );
  } else if (activeModal === "range") {
     const headers = ["Range Nilai", "Jumlah Paket", "Total Pagu (Rp)"];
     const rows = priceRanges.map(row => [
        row.name,
        row.count,
        row.pagu
     ]);
     const handleExport = () => {
        const csvRows: CsvRow[] = priceRanges.map(row => ({
           range: row.name,
           jumlah: row.count,
           pagu: row.pagu
        }));
        downloadCsv("paket-price-range.csv", csvRows);
     };
     modal = (
        <DataModal 
           title="Distribusi Nilai Paket" 
           description="Pengelompokan paket berdasarkan range nilai pagu" 
           headers={headers} 
           rows={rows} 
           onClose={() => setActiveModal(null)} 
           onExport={handleExport}
           exportLabel="Export CSV"
        />
     );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 p-1">
      {/* 1. Header & Stats Bar */}
      <div className="flex-none space-y-4">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
               title="Total Paket" 
               value={totalPaket} 
               subtext="Paket terdaftar" 
               icon={<Package className="h-4 w-4 text-blue-500" />} 
               loading={kpiLoading}
            />
            <StatCard 
               title="Total Pagu" 
               value={formatLargeCurrency(totalPagu)} 
               subtext="Akumulasi" 
               icon={<DollarSign className="h-4 w-4 text-emerald-500" />} 
               loading={kpiLoading}
            />
            <StatCard 
               title="Total HPS" 
               value={formatLargeCurrency(totalHps)} 
               subtext="Akumulasi HPS" 
               icon={<TrendingUp className="h-4 w-4 text-amber-500" />} 
               loading={kpiLoading}
            />
            <StatCard 
               title="Rata-rata" 
               value={formatCurrency(avgPaket)} 
               subtext="Per paket" 
               icon={<ArrowUpRight className="h-4 w-4 text-purple-500" />} 
               loading={kpiLoading}
               truncate
            />
         </div>
         
         <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     type="text"
                     placeholder="Cari nama paket, unit, agenda..."
                     className="pl-9 h-9 bg-slate-50 border-slate-200"
                     value={searchTerm}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
               </div>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-slate-200">
                     <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>Status: Aktif</DropdownMenuItem>
                     <DropdownMenuItem>Status: Selesai</DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>Clear Filters</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-1 bg-slate-100 p-1 rounded-md w-full md:w-auto">
               <Button 
                  variant={selectedView === "table" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`h-7 px-3 ${selectedView === "table" ? "shadow-sm bg-white" : "text-muted-foreground"}`}
                  onClick={() => setSelectedView("table")}
               >
                  <List className="h-4 w-4 mr-2" /> Table
               </Button>
               <Button 
                  variant={selectedView === "charts" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`h-7 px-3 ${selectedView === "charts" ? "shadow-sm bg-white" : "text-muted-foreground"}`}
                  onClick={() => setSelectedView("charts")}
               >
                  <BarChart3 className="h-4 w-4 mr-2" /> Charts
               </Button>
               <Button 
                  variant={selectedView === "split" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`h-7 px-3 ${selectedView === "split" ? "shadow-sm bg-white" : "text-muted-foreground"}`}
                  onClick={() => setSelectedView("split")}
               >
                  <div className="flex items-center">
                     <List className="h-3 w-3 mr-1" />
                     <span className="text-xs mx-1">|</span>
                     <PieChartIcon className="h-3 w-3 ml-1" />
                  </div>
               </Button>
            </div>
         </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden">
         {/* Table Section */}
         {(selectedView === "table" || selectedView === "split") && (
            <div className={`flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${selectedView === "split" ? "w-full lg:w-2/3" : "w-full"}`}>
               <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/50">
                  <div className="font-medium text-sm text-slate-700">
                     Daftar Paket ({filteredPackages.length})
                  </div>
                  <div className="text-xs text-muted-foreground">
                     Showing top 100
                  </div>
               </div>
               <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                     <thead className="sticky top-0 bg-white z-10 shadow-sm">
                        <tr className="border-b border-slate-200">
                           <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[120px]">
                              <button className="flex items-center gap-1 hover:text-slate-900" onClick={() => handleSort('tanggalDpp')}>
                                 Tanggal <ArrowUpDown className="h-3 w-3" />
                              </button>
                           </th>
                           <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[100px]">Unit</th>
                           <th className="h-10 px-4 text-left font-medium text-muted-foreground">Nama Paket</th>
                           <th className="h-10 px-4 text-right font-medium text-muted-foreground w-[150px]">
                              <button className="flex items-center justify-end gap-1 hover:text-slate-900 ml-auto" onClick={() => handleSort('pagu')}>
                                 Pagu <ArrowUpDown className="h-3 w-3" />
                              </button>
                           </th>
                           <th className="h-10 px-4 text-center font-medium text-muted-foreground w-[50px]"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                           Array.from({ length: 10 }).map((_, i) => (
                              <tr key={i}>
                                 <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                 <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                                 <td className="p-4"><Skeleton className="h-4 w-full" /></td>
                                 <td className="p-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                                 <td className="p-4"></td>
                              </tr>
                           ))
                        ) : filteredPackages.length === 0 ? (
                           <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                 Tidak ada paket ditemukan
                              </td>
                           </tr>
                        ) : (
                           filteredPackages.map((item, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                 <td className="p-4 whitespace-nowrap text-slate-500">
                                    {item.tanggalDpp ? (
                                       <div className="flex flex-col">
                                          <span className="font-medium text-slate-700">
                                             {item.tanggalDpp.getDate()} {item.tanggalDpp.toLocaleString('id-ID', { month: 'short' })}
                                          </span>
                                          <span className="text-xs">{item.tanggalDpp.getFullYear()}</span>
                                       </div>
                                    ) : "-"}
                                 </td>
                                 <td className="p-4 whitespace-nowrap">
                                    <Badge variant="outline" className="font-normal bg-slate-50">
                                       {item.unitKerja}
                                    </Badge>
                                 </td>
                                 <td className="p-4">
                                    <div className="font-medium text-slate-900 line-clamp-2" title={item.namaPaketPbj}>
                                       {item.namaPaketPbj}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                       <span>{item.noAgenda}</span>
                                       <span>•</span>
                                       <span>{item.uraianMakInduk || "Lainnya"}</span>
                                    </div>
                                 </td>
                                 <td className="p-4 text-right font-medium text-slate-900 whitespace-nowrap">
                                    {formatCurrency(item.paguAnggaranAktif || 0)}
                                 </td>
                                 <td className="p-4 text-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Charts Section */}
         {(selectedView === "charts" || selectedView === "split") && (
            <div className={`flex flex-col gap-4 overflow-y-auto ${selectedView === "split" ? "w-full lg:w-1/3" : "w-full"}`}>
               {/* Trend Chart */}
               <Card className="flex flex-col shadow-sm border-slate-200 flex-1 min-h-[300px]">
                  <CardHeader className="pb-2 border-slate-200">
                     <CardTitle className="text-sm font-medium">Trend Bulanan</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="label" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                              formatter={(value: any, name: any) => [
                                 name === "pagu" ? formatCurrency(value) : value,
                                 name === "pagu" ? "Total Pagu" : "Jumlah Paket"
                              ]}
                           />
                           <Bar yAxisId="left" dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={selectedView === "split" ? 15 : 30} />
                           {selectedView === "charts" && (
                              <Line type="monotone" dataKey="pagu" stroke="#f59e0b" strokeWidth={2} dot={{r: 3}} />
                           )}
                        </ComposedChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>

               {/* Distribution Chart */}
               <Card className="flex flex-col shadow-sm border-slate-200 flex-1 min-h-[300px]">
                  <CardHeader className="pb-2 border-slate-200">
                     <CardTitle className="text-sm font-medium">Distribusi Nilai</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0">
                     <div className="h-full w-full flex flex-col items-center">
                        <div className="flex-1 w-full min-h-[150px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={priceRanges}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={selectedView === "split" ? 30 : 50}
                                    outerRadius={selectedView === "split" ? 50 : 80}
                                    paddingAngle={2}
                                    dataKey="count"
                                 >
                                    {priceRanges.map((_, index) => (
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                 </Pie>
                                 <Tooltip formatter={(val: any) => val + " Paket"} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="w-full text-xs space-y-2 mt-2">
                           {priceRanges.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="truncate max-w-[120px]">{entry.name}</span>
                                 </div>
                                 <span className="font-medium text-slate-700">{entry.count}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
      
      {modal}
    </div>
  );
}

function StatCard({ title, value, subtext, icon, loading, truncate = false }: any) {
   return (
      <Card className="shadow-sm border-slate-200">
         <CardContent className="p-4">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                  {loading ? (
                     <Skeleton className="h-7 w-20 mt-1" />
                  ) : (
                     <h3 className={`text-xl font-bold text-slate-900 mt-1 ${truncate ? "truncate max-w-[120px]" : ""}`} title={truncate ? value : undefined}>
                        {value}
                     </h3>
                  )}
                  <p className={`text-xs text-slate-400 mt-1 ${truncate ? "truncate max-w-[120px]" : ""}`} title={truncate ? subtext : undefined}>
                     {subtext}
                  </p>
               </div>
               <div className="p-2 bg-slate-50 rounded-lg">
                  {icon}
               </div>
            </div>
         </CardContent>
      </Card>
   )
}
