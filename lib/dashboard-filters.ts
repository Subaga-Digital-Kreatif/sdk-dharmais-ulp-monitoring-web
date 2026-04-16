/**
 * Backend contract: see start/routes.ts (DASHBOARD_COMMON_FILTERS + DASHBOARD_PROC_FILTERS).
 * Param names must match exactly. Empty/undefined values are stripped.
 */

export type DashboardFilters = {
  startDate?: string;
  endDate?: string;
  ulpSatkerUnitEnduserId?: number;
  ulpSatkerUnitPengendaliId?: number;
  ulpMakCodeId?: number;
  ulpPpkCodeId?: number;
  ulpPerusahaanId?: number;
  metodePemilihan?: string;
  kriteriaBarangjasa?: string;
  keteranganTambahan?: string;
};

export const EMPTY_FILTERS: DashboardFilters = {};

export function toFilterParams(
  filters: DashboardFilters,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = value as string | number;
  }
  return out;
}

export function isFiltersEmpty(filters: DashboardFilters): boolean {
  return Object.values(filters).every(
    (v) => v === undefined || v === null || v === "",
  );
}

export const KETERANGAN_OPTIONS = [
  "Kaji Ulang PPK",
  "Sedang Berproses",
  "Selesai Dilaporkan",
] as const;

export const METODE_PEMILIHAN_OPTIONS = [
  "E-Pengadaan Langsung",
  "E-Penunjukan Langsung",
  "E-Purchasing",
  "E-Tender",
  "Pengadaan Langsung",
  "Penunjukan Langsung",
  "Tender",
] as const;

export const KRITERIA_BARANGJASA_OPTIONS = [
  "Barang",
  "Jasa Lainnya",
  "Pekerjaan Konstruksi",
] as const;
