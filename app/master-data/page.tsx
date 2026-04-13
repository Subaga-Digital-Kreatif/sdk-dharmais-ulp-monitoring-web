"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Database,
  LineChart,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { sections, sectionsById, type Field, type MakCode, type MenuId, type Perusahaan, type PpkCode, type SatkerUnit, type StagePreparation, type StageProcess } from "./sections";
export default function MasterDataPage() {
  const router = useRouter();
  const [active, setActive] = useState<MenuId>("perusahaan");
  const [companies, setCompanies] = useState<Perusahaan[]>([]);
  const [makCodes, setMakCodes] = useState<MakCode[]>([]);
  const [satkers, setSatkers] = useState<SatkerUnit[]>([]);
  const [ppkCodes, setPpkCodes] = useState<PpkCode[]>([]);
  const [preps, setPreps] = useState<StagePreparation[]>([]);
  const [procs, setProcs] = useState<StageProcess[]>([]);
  const [search, setSearch] = useState<string>("");
  const [tableFilters, setTableFilters] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const isAuthed = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      return (
        localStorage.getItem("ulp_auth_demo") === "1" ||
        sessionStorage.getItem("ulp_auth_demo") === "1"
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isAuthed) router.replace("/login");
  }, [isAuthed, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/master-data", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        setCompanies(json.perusahaan || []);
        setMakCodes(json.mak || []);
        setSatkers(json.satker || []);
        setPpkCodes(json.ppk || []);
        setPreps(json.persiapan || []);
        setProcs(json.proses || []);
      } catch {}
    }
    load();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("ulp_auth_demo");
      sessionStorage.removeItem("ulp_auth_demo");
    } catch {
    }
    router.push("/login");
  };

  const menu = sections;

  function resetModal() {
    setShowModal(false);
    setEditIndex(-1);
  }

  function setActiveMenu(id: MenuId) {
    setActive(id);
    setSearch("");
    setTableFilters({});
    setPage(1);
  }

  function openAdd() {
    setEditIndex(-1);
    setShowModal(true);
  }

  function openEdit(i: number) {
    setEditIndex(i);
    setShowModal(true);
  }

  function saveCurrent(formData: Record<string, string>) {
    if (active === "perusahaan") {
      const section = sectionsById.perusahaan;
      const prev = editIndex >= 0 ? companies[editIndex] : undefined;
      const next = section.build({ formData, prev, items: companies });
      const arr = [...companies];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setCompanies(arr);
    } else if (active === "mak") {
      const section = sectionsById.mak;
      const prev = editIndex >= 0 ? makCodes[editIndex] : undefined;
      const next = section.build({ formData, prev, items: makCodes });
      const arr = [...makCodes];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setMakCodes(arr);
    } else if (active === "satker") {
      const section = sectionsById.satker;
      const prev = editIndex >= 0 ? satkers[editIndex] : undefined;
      const next = section.build({ formData, prev, items: satkers });
      const arr = [...satkers];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setSatkers(arr);
    } else if (active === "ppk") {
      const section = sectionsById.ppk;
      const prev = editIndex >= 0 ? ppkCodes[editIndex] : undefined;
      const next = section.build({ formData, prev, items: ppkCodes });
      const arr = [...ppkCodes];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setPpkCodes(arr);
    } else if (active === "persiapan") {
      const section = sectionsById.persiapan;
      const prev = editIndex >= 0 ? preps[editIndex] : undefined;
      const next = section.build({ formData, prev, items: preps });
      const arr = [...preps];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setPreps(arr);
    } else if (active === "proses") {
      const section = sectionsById.proses;
      const prev = editIndex >= 0 ? procs[editIndex] : undefined;
      const next = section.build({ formData, prev, items: procs });
      const arr = [...procs];
      if (editIndex >= 0) arr[editIndex] = next;
      else arr.unshift(next);
      setProcs(arr);
    }
    resetModal();
  }

  function removeRow(i: number) {
    if (active === "perusahaan") {
      const arr = [...companies];
      arr.splice(i, 1);
      setCompanies(arr);
    } else if (active === "mak") {
      const arr = [...makCodes];
      arr.splice(i, 1);
      setMakCodes(arr);
    } else if (active === "satker") {
      const arr = [...satkers];
      arr.splice(i, 1);
      setSatkers(arr);
    } else if (active === "ppk") {
      const arr = [...ppkCodes];
      arr.splice(i, 1);
      setPpkCodes(arr);
    } else if (active === "persiapan") {
      const arr = [...preps];
      arr.splice(i, 1);
      setPreps(arr);
    } else if (active === "proses") {
      const arr = [...procs];
      arr.splice(i, 1);
      setProcs(arr);
    }
  }

  const activeFilterFields = useMemo(() => {
    if (active === "perusahaan") {
      const section = sectionsById.perusahaan;
      const defs = section.filters;
      return typeof defs === "function" ? defs(companies) : defs || [];
    }
    if (active === "mak") {
      const section = sectionsById.mak;
      const defs = section.filters;
      return typeof defs === "function" ? defs(makCodes) : defs || [];
    }
    if (active === "satker") {
      const section = sectionsById.satker;
      const defs = section.filters;
      return typeof defs === "function" ? defs(satkers) : defs || [];
    }
    if (active === "ppk") {
      const section = sectionsById.ppk;
      const defs = section.filters;
      return typeof defs === "function" ? defs(ppkCodes) : defs || [];
    }
    if (active === "persiapan") {
      const section = sectionsById.persiapan;
      const defs = section.filters;
      return typeof defs === "function" ? defs(preps) : defs || [];
    }
    const section = sectionsById.proses;
    const defs = section.filters;
    return typeof defs === "function" ? defs(procs) : defs || [];
  }, [active, companies, makCodes, satkers, ppkCodes, preps, procs]);

  function filteredWithIndex<T>(
    arr: T[],
    pick: (x: T) => string,
    filters?: Field[]
  ): { item: T; index: number }[] {
    const q = search.trim().toLowerCase();
    const base = arr.map((item, index) => ({ item, index }));
    const withFilters =
      filters && filters.length
        ? base.filter(({ item }) => {
            for (const f of filters) {
              const v = (tableFilters[f.name] || "").trim();
              if (!v) continue;
              const raw = (item as unknown as Record<string, unknown>)[f.name];
              const cur = raw === null || raw === undefined ? "" : String(raw);

              if (f.select) {
                if (cur !== v) return false;
              } else if (f.type === "number") {
                if (Number(cur || 0) !== Number(v)) return false;
              } else if (f.type === "date") {
                if ((cur || "").slice(0, 10) !== v) return false;
              } else {
                if (!cur.toLowerCase().includes(v.toLowerCase())) return false;
              }
            }
            return true;
          })
        : base;

    if (!q) return withFilters;
    return withFilters.filter((x) => pick(x.item).toLowerCase().includes(q));
  }

  function autoLabel(key: string) {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function autoField(name: string, value: string): Field {
    const trimmed = (value ?? "").trim();
    const isBool = trimmed === "true" || trimmed === "false";
    const isNumber = trimmed !== "" && /^-?\d+(\.\d+)?$/.test(trimmed);
    const isIsoDate = /^\d{4}-\d{2}-\d{2}/.test(trimmed);
    const isTextArea = trimmed.length > 80 || trimmed.includes("\n");

    if (isBool) {
      return {
        name,
        label: autoLabel(name),
        select: [
          { value: "true", label: "Ya" },
          { value: "false", label: "Tidak" },
        ],
      };
    }

    return {
      name,
      label: autoLabel(name),
      type: isIsoDate ? "date" : isNumber ? "number" : "text",
      textarea: !isIsoDate && !isNumber && isTextArea ? true : undefined,
    };
  }

  if (!isAuthed) {
    return <div className="min-h-screen bg-[#F7FBFF]" />;
  }

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#0B1E33]">
      <header className="flex items-center justify-between border-b border-[#E1ECF7] bg-white px-4 py-2.5 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0066CC] text-white">
              <LineChart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5B6B7F]">
                RS KANKER DHARMAIS
              </p>
              <p className="text-sm font-semibold">Master Data</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xs text-[#5B6B7F] sm:flex">
            <Badge variant="soft" className="gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Pengadaan Barang & Jasa
            </Badge>
            <div className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Realtime Monitoring</span>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8 gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
      </header>

      <main className="mx-auto grid w-full grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:px-6">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="gap-2">
              <CardTitle className="text-base">Menu</CardTitle>
              <CardDescription>Pilih tabel master data untuk dikelola.</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <nav className="grid gap-1.5">
                {menu.map((m) => {
                  const Icon = m.icon;
                  const isActive = active === m.id;
                  const count =
                    m.id === "perusahaan"
                      ? companies.length
                      : m.id === "mak"
                      ? makCodes.length
                      : m.id === "satker"
                      ? satkers.length
                      : m.id === "ppk"
                      ? ppkCodes.length
                      : m.id === "persiapan"
                      ? preps.length
                      : procs.length;
                  return (
                    <button
                      key={m.id}
                      className={[
                        "group relative flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "border-[#C9E3FF] bg-[#E6F3FF] text-[#0066CC]"
                          : "border-transparent bg-white text-[#0B1E33] hover:border-[#E1ECF7] hover:bg-[#F7FBFF]",
                      ].join(" ")}
                      onClick={() => setActiveMenu(m.id as typeof active)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={[
                            "grid h-8 w-8 place-items-center rounded-lg border",
                            isActive
                              ? "border-[#C9E3FF] bg-white text-[#0066CC]"
                              : "border-[#E1ECF7] bg-white text-[#5B6B7F] group-hover:text-[#0066CC]",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{m.label}</span>
                      </span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          isActive ? "bg-white text-[#0066CC]" : "bg-[#F0F4FA] text-[#5B6B7F]",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                      {isActive ? (
                        <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-1 rounded-r-full bg-[#0066CC]" />
                      ) : null}
                    </button>
                  );
                })}
              </nav>

            </CardContent>
          </Card>
        </aside>

        <section className="min-w-0">
          <Card className="overflow-hidden">
            <CardHeader className="gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-base">{sectionsById[active].label}</CardTitle>
                  <CardDescription>
                    CRUD frontend menggunakan data. Integrasi API bisa ditambahkan kemudian.
                  </CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-[260px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B7F]" />
                    <Input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Cari..."
                      className="h-9 border-[#C9E3FF] bg-white pl-9 text-sm focus-visible:ring-[#0066CC]"
                    />
                  </div>
                  <Button className="h-9 gap-2" onClick={openAdd}>
                    <Plus className="h-4 w-4" />
                    Tambah
                  </Button>
                </div>
              </div>
              {activeFilterFields.length ? (
                <FilterBar
                  filters={activeFilterFields}
                  values={tableFilters}
                  onChange={(name: string, value: string) => {
                    setTableFilters((p) => ({ ...p, [name]: value }));
                    setPage(1);
                  }}
                  onReset={() => {
                    setTableFilters({});
                    setPage(1);
                  }}
                />
              ) : null}
            </CardHeader>
            <CardContent className="p-0">

          {active === "perusahaan" && (() => {
            const filtered = filteredWithIndex(companies, sectionsById.perusahaan.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.perusahaan.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.perusahaan.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "mak" && (() => {
            const filtered = filteredWithIndex(makCodes, sectionsById.mak.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.mak.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.mak.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "satker" && (() => {
            const filtered = filteredWithIndex(satkers, sectionsById.satker.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.satker.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.satker.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "ppk" && (() => {
            const filtered = filteredWithIndex(ppkCodes, sectionsById.ppk.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.ppk.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.ppk.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "persiapan" && (() => {
            const filtered = filteredWithIndex(preps, sectionsById.persiapan.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.persiapan.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.persiapan.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}

          {active === "proses" && (() => {
            const filtered = filteredWithIndex(procs, sectionsById.proses.pick, activeFilterFields);
            return (
            <DataTable
              columns={sectionsById.proses.columns}
              rows={filtered.map(({ item, index }) => ({
                index,
                cells: sectionsById.proses.toRow(item),
              }))}
              total={filtered.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={openEdit}
              onDelete={removeRow}
            />
          )})()}
            </CardContent>
          </Card>
        </section>
      </main>

      {showModal && (
        (() => {
          const initial =
            active === "perusahaan"
              ? sectionsById.perusahaan.initial(editIndex >= 0 ? companies[editIndex] : undefined)
              : active === "mak"
              ? sectionsById.mak.initial(editIndex >= 0 ? makCodes[editIndex] : undefined)
              : active === "satker"
              ? sectionsById.satker.initial(editIndex >= 0 ? satkers[editIndex] : undefined)
              : active === "ppk"
              ? sectionsById.ppk.initial(editIndex >= 0 ? ppkCodes[editIndex] : undefined)
              : active === "persiapan"
              ? sectionsById.persiapan.initial(editIndex >= 0 ? preps[editIndex] : undefined)
              : sectionsById.proses.initial(editIndex >= 0 ? procs[editIndex] : undefined);

          const base = sectionsById[active].fields;
          const existing = new Set(base.map((f) => f.name));
          const extra = Object.keys(initial)
            .filter((k) => !existing.has(k))
            .sort((a, b) => a.localeCompare(b))
            .map((k) => autoField(k, initial[k] || ""));

          return (
            <EditModal
              key={`${active}:${editIndex}`}
              title={`${editIndex >= 0 ? "Edit" : "Tambah"} ${sectionsById[active].label}`}
              onClose={resetModal}
              onSave={saveCurrent}
              fields={[...base, ...extra]}
              initial={initial}
            />
          );
        })()
      )}
    </div>
  );
}

function FilterBar({
  filters,
  values,
  onChange,
  onReset,
}: {
  filters: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onReset: () => void;
}) {
  const activeCount = Object.values(values).filter((v) => (v || "").trim().length > 0).length;
  return (
    <div className="flex flex-wrap items-end gap-2 border-t border-[#F0F4FA] pt-3">
      {filters.map((f) => (
        <div key={f.name} className="min-w-[160px] space-y-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F]">
            {f.label}
          </div>
          {f.select ? (
            <select
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              className="h-9 w-full rounded-xl border border-[#C9E3FF] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0066CC]"
            >
              <option value="">Semua</option>
              {f.select.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              type={f.type || "text"}
              placeholder="Semua"
              className="h-9 border-[#C9E3FF] bg-white text-sm focus-visible:ring-[#0066CC]"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-[#C9E3FF] bg-white text-sm"
          onClick={onReset}
          disabled={activeCount === 0}
        >
          Reset Filter
        </Button>
        {activeCount ? (
          <span className="text-xs text-[#5B6B7F]">({activeCount} aktif)</span>
        ) : null}
      </div>
    </div>
  );
}

function DataTable({
  columns,
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: {
  columns: string[];
  rows: { index: number; cells: string[] }[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * pageSize;
  const end = start + pageSize;
  const view = rows.slice(start, end);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(end, total);
  return (
    <div className="overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white/90 text-[11px] font-medium uppercase tracking-wide text-[#5B6B7F] backdrop-blur">
            <tr className="border-b border-[#E1ECF7]">
              <th className="w-12 px-4 py-3 text-left"> </th>
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 text-left">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4FA]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-14">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#E1ECF7] bg-[#F7FBFF] text-[#0066CC]">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold">Belum ada data</div>
                    <div className="text-xs text-[#5B6B7F]">
                      Klik tombol “Tambah” untuk membuat entri baru.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              view.map((r) => (
                <tr key={r.index} className="group hover:bg-[#F7FBFF]">
                  <td className="px-2 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#5B6B7F] hover:text-[#0066CC]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(r.index)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => onDelete(r.index)}
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  {r.cells.map((cell, j) => {
                    const value = cell?.trim() ? cell : "—";
                    return (
                      <td key={j} className="px-4 py-2.5 align-top">
                        <div className="max-w-[340px] truncate" title={value}>
                          {value}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#E1ECF7] bg-white px-4 py-2 text-xs text-[#5B6B7F]">
        <div>
          Menampilkan {from}-{to} dari {total}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-[#C9E3FF] bg-white px-2"
          >
            {[10, 25, 50].map((s) => (
              <option key={s} value={s}>
                {s}/halaman
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              Prev
            </Button>
            <div className="px-2">
              {page} / {pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onPageChange(Math.min(pages, cur + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  title,
  onClose,
  onSave,
  fields,
  initial,
}: {
  title: string;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  fields: Field[];
  initial: Record<string, string>;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => initial || {});

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1E33]/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-3xl items-center">
        <Card className="w-full overflow-hidden shadow-xl">
          <div className="h-1.5 bg-gradient-to-r from-[#0066CC] via-sky-400 to-emerald-400" />
          <CardHeader className="gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>Lengkapi field yang diperlukan lalu simpan perubahan.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[68vh] overflow-auto">
            <FormGrid
              fields={fields}
              values={formData}
              onChange={(name, value) => setFormData((p) => ({ ...p, [name]: value }))}
            />
          </CardContent>
          <div className="flex items-center justify-end gap-2 border-t border-[#F0F4FA] bg-white p-4">
            <Button variant="outline" className="h-9" onClick={onClose}>
              Batal
            </Button>
            <Button className="h-9" onClick={() => onSave(formData)}>
              Simpan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FormGrid({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <div className="text-xs font-medium text-[#5B6B7F]">{f.label}</div>
          {f.select ? (
            <select
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              disabled={Boolean(f.readonly)}
              className={[
                "h-10 w-full rounded-xl border border-[#C9E3FF] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0066CC]",
                f.readonly ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]" : "",
              ].join(" ")}
            >
              <option value="" />
              {f.select.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.textarea ? (
            <textarea
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              disabled={Boolean(f.readonly)}
              className={[
                "min-h-[96px] w-full rounded-xl border border-[#C9E3FF] bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#0066CC]",
                f.readonly ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]" : "",
              ].join(" ")}
            />
          ) : (
            <Input
              value={values[f.name] || ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              type={f.type || "text"}
              disabled={Boolean(f.readonly)}
              className={[
                "h-10 border-[#C9E3FF] bg-white text-sm focus-visible:ring-[#0066CC]",
                f.readonly ? "cursor-not-allowed bg-[#F7FBFF] text-[#5B6B7F]" : "",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
