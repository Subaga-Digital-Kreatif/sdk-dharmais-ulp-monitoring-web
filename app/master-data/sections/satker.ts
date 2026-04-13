import { LibrarySquare } from "lucide-react";
import { toFlat } from "./utils";
import type { SatkerUnit, SectionDef } from "./section-types";

export const satkerSection: SectionDef<SatkerUnit, "satker"> = {
  id: "satker",
  label: "Satker Unit",
  icon: LibrarySquare,
  columns: ["ID", "Kode Pengendali", "Kode", "Nama", "Direktorat"],
  pick: (x) => x.satker_unit_nama,
  toRow: (x) => [
    String(x.id),
    x.satker_unit_pengendali_kode,
    x.satker_unit_kode,
    x.satker_unit_nama,
    x.satker_unit_direktorat,
  ],
  filters: (items) => {
    const directorats = Array.from(
      new Set(items.map((x) => x.satker_unit_direktorat).filter((x) => x && x.trim()))
    ).sort((a, b) => a.localeCompare(b));

    return [
      {
        name: "satker_unit_direktorat",
        label: "Direktorat",
        select: directorats.map((d) => ({ value: d, label: d })),
      },
      { name: "satker_unit_pengendali_kode", label: "Kode Pengendali" },
      { name: "satker_unit_kode", label: "Kode Unit" },
    ];
  },
  fields: [
    { name: "satker_unit_pengendali_kode", label: "Kode Pengendali" },
    { name: "satker_unit_kode", label: "Kode" },
    { name: "satker_unit_nama", label: "Nama" },
    { name: "satker_unit_direktorat", label: "Direktorat" },
  ],
  initial: (item) => toFlat(item),
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id)) + 1,
    satker_unit_pengendali_kode: formData.satker_unit_pengendali_kode || "",
    satker_unit_kode: formData.satker_unit_kode || "",
    satker_unit_nama: formData.satker_unit_nama || "",
    satker_unit_direktorat: formData.satker_unit_direktorat || "",
    created_at: prev?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }),
};
