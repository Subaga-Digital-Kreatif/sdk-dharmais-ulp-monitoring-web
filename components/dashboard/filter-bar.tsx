"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter as FilterIcon,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/models/api";
import {
  type DashboardFilters,
  isFiltersEmpty,
  KETERANGAN_OPTIONS,
  KRITERIA_BARANGJASA_OPTIONS,
  METODE_PEMILIHAN_OPTIONS,
} from "@/lib/dashboard-filters";

type Option = { value: number | string; label: string; hint?: string };

type SatkerItem = {
  id: number;
  satkerUnitKode: string;
  satkerUnitNama: string;
  satkerUnitDirektorat: string;
};
type MakItem = {
  id: number;
  makKode: string;
  makRinci: string | null;
  makKeterangan: string | null;
};
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

type FilterKey =
  | "keteranganTambahan"
  | "ulpSatkerUnitEnduserId"
  | "ulpSatkerUnitPengendaliId"
  | "ulpMakCodeId"
  | "ulpPpkCodeId"
  | "metodePemilihan"
  | "kriteriaBarangjasa"
  | "ulpPerusahaanId";

const FILTER_LABELS: Record<FilterKey, string> = {
  keteranganTambahan: "Status",
  ulpSatkerUnitEnduserId: "Enduser",
  ulpSatkerUnitPengendaliId: "Pengendali",
  ulpMakCodeId: "MAK",
  ulpPpkCodeId: "PPK",
  metodePemilihan: "Metode",
  kriteriaBarangjasa: "Kriteria",
  ulpPerusahaanId: "Penyedia",
};

const PREP_KEYS: FilterKey[] = [
  "keteranganTambahan",
  "ulpSatkerUnitEnduserId",
  "ulpSatkerUnitPengendaliId",
  "ulpMakCodeId",
  "ulpPpkCodeId",
];
const PROC_EXTRA_KEYS: FilterKey[] = [
  "metodePemilihan",
  "kriteriaBarangjasa",
  "ulpPerusahaanId",
];

export type DashboardFilterBarProps = {
  value: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  mode?: "prep" | "proc";
  className?: string;
};

export function DashboardFilterBar({
  value,
  onChange,
  mode = "proc",
  className,
}: DashboardFilterBarProps) {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [satkerOpts, setSatkerOpts] = useState<Option[]>([]);
  const [makOpts, setMakOpts] = useState<Option[]>([]);
  const [ppkOpts, setPpkOpts] = useState<Option[]>([]);
  const [perusahaanOpts, setPerusahaanOpts] = useState<Option[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  const allKeys = useMemo(
    () => (mode === "proc" ? [...PREP_KEYS, ...PROC_EXTRA_KEYS] : PREP_KEYS),
    [mode],
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchOptions<SatkerItem>("/ulp-satker-unit-codes", (r) => ({
        value: r.id,
        label: `${r.satkerUnitKode} — ${r.satkerUnitNama}`,
        hint: r.satkerUnitDirektorat,
      })),
      fetchOptions<MakItem>("/ulp-mak-codes", (r) => ({
        value: r.id,
        label: r.makRinci
          ? `${r.makKode} — ${r.makRinci}`
          : r.makKode,
        hint: r.makKeterangan ?? undefined,
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

  useEffect(() => {
    if (!openKey && !addMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) {
        setOpenKey(null);
        setAddMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenKey(null);
        setAddMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openKey, addMenuOpen]);

  const activeKeys = useMemo((): FilterKey[] => {
    const keys: FilterKey[] = [];
    const simple: FilterKey[] = [
      "keteranganTambahan",
      "ulpSatkerUnitEnduserId",
      "ulpSatkerUnitPengendaliId",
      "ulpMakCodeId",
      "ulpPpkCodeId",
      "metodePemilihan",
      "kriteriaBarangjasa",
      "ulpPerusahaanId",
    ];
    for (const k of simple) {
      if (value[k] !== undefined && value[k] !== null && value[k] !== "")
        keys.push(k);
    }
    return keys.filter((k) => allKeys.includes(k));
  }, [value, allKeys]);

  const availableToAdd = allKeys.filter((k) => !activeKeys.includes(k));

  const setValue = (partial: DashboardFilters) => {
    onChange({ ...value, ...partial });
  };

  const removeKey = (key: FilterKey) => {
    const next: DashboardFilters = { ...value };
    delete next[key];
    onChange(next);
  };

  const reset = () => onChange({});

  const optsFor = (key: FilterKey): Option[] => {
    switch (key) {
      case "keteranganTambahan":
        return KETERANGAN_OPTIONS.map((o) => ({ value: o, label: o }));
      case "metodePemilihan":
        return METODE_PEMILIHAN_OPTIONS.map((o) => ({ value: o, label: o }));
      case "kriteriaBarangjasa":
        return KRITERIA_BARANGJASA_OPTIONS.map((o) => ({ value: o, label: o }));
      case "ulpSatkerUnitEnduserId":
      case "ulpSatkerUnitPengendaliId":
        return satkerOpts;
      case "ulpMakCodeId":
        return makOpts;
      case "ulpPpkCodeId":
        return ppkOpts;
      case "ulpPerusahaanId":
        return perusahaanOpts;
      default:
        return [];
    }
  };

  const displayValue = (key: FilterKey): string => {
    const v = value[key as keyof DashboardFilters];
    if (v === undefined || v === null || v === "") return "";
    const opt = optsFor(key).find((o) => String(o.value) === String(v));
    return opt?.label ?? String(v);
  };

  return (
    <div
      ref={barRef}
      className={cn(
        "relative flex flex-wrap items-center gap-1.5 rounded-lg border border-[#E1ECF7] bg-white px-2 py-1.5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-1 px-1 text-xs font-medium text-[#0B1E33]">
        <FilterIcon className="h-3.5 w-3.5 text-[#0066CC]" />
        Filter
      </div>

      {activeKeys.length > 0 && (
        <div className="h-4 w-px bg-[#E1ECF7]" aria-hidden />
      )}

      {activeKeys.map((key) => (
        <FilterChip
          key={key}
          label={FILTER_LABELS[key]}
          value={displayValue(key)}
          active={openKey === key}
          onClick={() => {
            setOpenKey(openKey === key ? null : key);
            setAddMenuOpen(false);
          }}
          onRemove={() => removeKey(key)}
        />
      ))}

      {availableToAdd.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAddMenuOpen((s) => !s);
              setOpenKey(null);
            }}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-dashed border-[#C9E3FF] px-2 text-xs text-[#0066CC] hover:bg-[#E6F3FF]"
          >
            <Plus className="h-3 w-3" />
            {activeKeys.length === 0 ? "Tambah filter" : "Tambah"}
          </button>
          {addMenuOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-[#E1ECF7] bg-white shadow-lg">
              {availableToAdd.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setAddMenuOpen(false);
                    setOpenKey(k);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#0B1E33] hover:bg-[#E6F3FF]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9E3FF]" />
                  {FILTER_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        {!isFiltersEmpty(value) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[#5B6B7F] hover:bg-[#E6F3FF] hover:text-[#0B1E33]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {openKey && (
        <div className="absolute left-2 top-full z-50 mt-1 min-w-[280px] max-w-[360px]">
          <ComboboxEditor
            options={optsFor(openKey)}
            value={value[openKey as keyof DashboardFilters]}
            onSelect={(v) => {
              setValue({ [openKey]: v } as DashboardFilters);
              setOpenKey(null);
            }}
            onClear={() => {
              removeKey(openKey);
              setOpenKey(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  value,
  active,
  onClick,
  onRemove,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-7 items-center gap-0.5 rounded-md border text-xs",
        active
          ? "border-[#0066CC] bg-[#E6F3FF]"
          : "border-[#C9E3FF] bg-[#F7FBFF] hover:bg-[#E6F3FF]",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 px-2 py-0.5"
      >
        <span className="font-medium text-[#0066CC]">{label}:</span>
        <span className="max-w-[140px] truncate text-[#0B1E33]">{value}</span>
        <ChevronDown className="h-3 w-3 text-[#5B6B7F]" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Hapus filter ${label}`}
        className="mr-1 rounded-sm p-0.5 text-[#5B6B7F] hover:bg-white hover:text-[#0B1E33]"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function ComboboxEditor({
  options,
  value,
  onSelect,
  onClear,
}: {
  options: Option[];
  value: string | number | undefined;
  onSelect: (v: string | number) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.hint ?? "").toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <div className="overflow-hidden rounded-md border border-[#E1ECF7] bg-white shadow-lg">
      <div className="flex items-center gap-2 border-b border-[#E1ECF7] px-2 py-1.5">
        <Search className="h-3.5 w-3.5 text-[#5B6B7F]" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari…"
          className="h-6 w-full flex-1 bg-transparent text-xs text-[#0B1E33] placeholder:text-[#5B6B7F] focus:outline-none"
        />
      </div>
      <div className="max-h-[280px] overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-xs text-[#5B6B7F]">Tidak ada hasil</div>
        ) : (
          filtered.map((o) => {
            const selected = String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onSelect(o.value)}
                className={cn(
                  "flex w-full items-start gap-2 px-3 py-1.5 text-left text-xs hover:bg-[#E6F3FF]",
                  selected && "bg-[#E6F3FF]",
                )}
              >
                <Check
                  className={cn(
                    "mt-0.5 h-3 w-3 shrink-0",
                    selected ? "text-[#0066CC]" : "text-transparent",
                  )}
                />
                <span className="flex-1">
                  <span className="block text-[#0B1E33]">{o.label}</span>
                  {o.hint && (
                    <span className="block text-[10px] text-[#5B6B7F]">
                      {o.hint}
                    </span>
                  )}
                </span>
              </button>
            );
          })
        )}
      </div>
      {value !== undefined && value !== null && value !== "" && (
        <div className="border-t border-[#E1ECF7] p-1">
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center justify-center gap-1 rounded px-2 py-1 text-[11px] text-[#5B6B7F] hover:bg-[#F7FBFF]"
          >
            <X className="h-3 w-3" />
            Hapus pilihan
          </button>
        </div>
      )}
    </div>
  );
}

