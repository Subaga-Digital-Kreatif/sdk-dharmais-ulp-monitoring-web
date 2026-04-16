"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/models/api";
import {
  type DashboardFilters,
  isFiltersEmpty,
  KETERANGAN_OPTIONS,
  KRITERIA_BARANGJASA_OPTIONS,
  METODE_PEMILIHAN_OPTIONS,
} from "@/lib/dashboard-filters";

type Option = { value: number | string; label: string };

type SatkerItem = {
  id: number;
  satkerUnitKode: string;
  satkerUnitNama: string;
};
type MakItem = { id: number; makKode: string; makKeterangan: string | null };
type PpkItem = { id: number; ppkKode: string; ppkNomenklatur: string };
type PerusahaanItem = { id: number; perusahaanNama: string };

type ListResp<T> = { data: T[] };

async function fetchOptions<T>(
  path: string,
  toOpt: (row: T) => Option,
): Promise<Option[]> {
  try {
    const res = await api.get<ListResp<T>>(path, { params: { perPage: 100 } });
    return (res.data?.data ?? []).map(toOpt);
  } catch {
    return [];
  }
}

export type DashboardFilterBarProps = {
  value: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  /** "prep" hides metode/kriteria/perusahaan; "proc" shows everything. */
  mode?: "prep" | "proc";
  className?: string;
};

export function DashboardFilterBar({
  value,
  onChange,
  mode = "proc",
  className,
}: DashboardFilterBarProps) {
  const [draft, setDraft] = useState<DashboardFilters>(value);
  const [satkerOpts, setSatkerOpts] = useState<Option[]>([]);
  const [makOpts, setMakOpts] = useState<Option[]>([]);
  const [ppkOpts, setPpkOpts] = useState<Option[]>([]);
  const [perusahaanOpts, setPerusahaanOpts] = useState<Option[]>([]);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchOptions<SatkerItem>("/ulp-satker-unit-codes", (r) => ({
        value: r.id,
        label: `${r.satkerUnitKode} — ${r.satkerUnitNama}`,
      })),
      fetchOptions<MakItem>("/ulp-mak-codes", (r) => ({
        value: r.id,
        label: r.makKeterangan ? `${r.makKode} — ${r.makKeterangan}` : r.makKode,
      })),
      fetchOptions<PpkItem>("/admin/ulp-ppk-codes", (r) => ({
        value: r.id,
        label: `${r.ppkKode} — ${r.ppkNomenklatur}`,
      })),
      mode === "proc"
        ? fetchOptions<PerusahaanItem>("/admin/ulp-perusahaan-codes", (r) => ({
            value: r.id,
            label: r.perusahaanNama,
          }))
        : Promise.resolve<Option[]>([]),
    ]).then(([s, m, p, pr]) => {
      if (cancelled) return;
      setSatkerOpts(s);
      setMakOpts(m);
      setPpkOpts(p);
      setPerusahaanOpts(pr);
    });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const activeCount = useMemo(
    () => Object.values(value).filter((v) => v !== undefined && v !== null && v !== "").length,
    [value],
  );

  const apply = () => onChange(draft);
  const reset = () => {
    setDraft({});
    onChange({});
  };

  const update = <K extends keyof DashboardFilters>(
    key: K,
    raw: string | number | undefined,
  ) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (raw === undefined || raw === "" || raw === "__all__") {
        delete next[key];
      } else {
        (next[key] as DashboardFilters[K]) = raw as DashboardFilters[K];
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-2 rounded-lg border border-[#E1ECF7] bg-white px-3 py-2 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#0B1E33]">
        <Filter className="h-3.5 w-3.5 text-[#0066CC]" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-[#0066CC] px-1.5 py-0.5 text-[10px] text-white">
            {activeCount}
          </span>
        )}
      </div>

      <FieldDate
        label="Dari"
        value={draft.startDate ?? ""}
        onChange={(v) => update("startDate", v)}
      />
      <FieldDate
        label="Sampai"
        value={draft.endDate ?? ""}
        onChange={(v) => update("endDate", v)}
      />

      <FieldSelect
        label="Enduser"
        value={draft.ulpSatkerUnitEnduserId}
        options={satkerOpts}
        onChange={(v) => update("ulpSatkerUnitEnduserId", v ? Number(v) : undefined)}
      />
      <FieldSelect
        label="Pengendali"
        value={draft.ulpSatkerUnitPengendaliId}
        options={satkerOpts}
        onChange={(v) => update("ulpSatkerUnitPengendaliId", v ? Number(v) : undefined)}
      />
      <FieldSelect
        label="MAK"
        value={draft.ulpMakCodeId}
        options={makOpts}
        onChange={(v) => update("ulpMakCodeId", v ? Number(v) : undefined)}
      />
      <FieldSelect
        label="PPK"
        value={draft.ulpPpkCodeId}
        options={ppkOpts}
        onChange={(v) => update("ulpPpkCodeId", v ? Number(v) : undefined)}
      />
      <FieldSelect
        label="Status"
        value={draft.keteranganTambahan}
        options={KETERANGAN_OPTIONS.map((o) => ({ value: o, label: o }))}
        onChange={(v) => update("keteranganTambahan", v || undefined)}
      />

      {mode === "proc" && (
        <>
          <FieldSelect
            label="Metode"
            value={draft.metodePemilihan}
            options={METODE_PEMILIHAN_OPTIONS.map((o) => ({ value: o, label: o }))}
            onChange={(v) => update("metodePemilihan", v || undefined)}
          />
          <FieldSelect
            label="Kriteria"
            value={draft.kriteriaBarangjasa}
            options={KRITERIA_BARANGJASA_OPTIONS.map((o) => ({ value: o, label: o }))}
            onChange={(v) => update("kriteriaBarangjasa", v || undefined)}
          />
          <FieldSelect
            label="Penyedia"
            value={draft.ulpPerusahaanId}
            options={perusahaanOpts}
            onChange={(v) => update("ulpPerusahaanId", v ? Number(v) : undefined)}
          />
        </>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" variant="outline" onClick={reset} disabled={isFiltersEmpty(value) && isFiltersEmpty(draft)}>
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset
        </Button>
        <Button size="sm" onClick={apply}>
          Terapkan
        </Button>
      </div>
    </div>
  );
}

function FieldDate({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
      {label}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="h-8 rounded border border-[#C9E3FF] bg-white px-2 text-[11px] text-[#0B1E33] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={`Hapus filter ${label}`}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded text-[#5B6B7F] hover:bg-[#E6F3FF]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </label>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number | undefined;
  options: Option[];
  onChange: (v: string | undefined) => void;
}) {
  const v = value === undefined || value === null ? "" : String(value);
  return (
    <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
      {label}
      <select
        value={v}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={options.length === 0}
        className="h-8 max-w-[160px] truncate rounded border border-[#C9E3FF] bg-white px-2 text-[11px] text-[#0B1E33] focus:outline-none focus:ring-1 focus:ring-[#0066CC] disabled:opacity-50"
      >
        <option value="">Semua</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
