import { LibrarySquare } from "lucide-react";

import type { SatkerUnit, SectionDef } from "./section-types";

export const satkerSection: SectionDef<SatkerUnit, "satker"> = {
  id: "satker",
  label: "Satker Unit",
  icon: LibrarySquare,
  columns: ["ID", "Kode Pengendali", "Kode", "Nama", "Direktorat"],
  pick: (x) => x.satkerUnitNama,
  toRow: (x) => [
    String(x.id),
    x.satkerUnitPengendaliKode,
    x.satkerUnitKode,
    x.satkerUnitNama,
    x.satkerUnitDirektorat,
  ],
  filters: (items) => {
    const directorats = Array.from(
      new Set(
        items
          .map((x) => x.satkerUnitDirektorat)
          .filter((x) => x && x.trim()),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return [
      {
        name: "satkerUnitDirektorat",
        label: "Direktorat",
        select: directorats.map((d) => ({ value: d, label: d })),
      },
      { name: "satkerUnitPengendaliKode", label: "Kode Pengendali" },
      { name: "satkerUnitKode", label: "Kode Unit" },
    ];
  },
  fields: [
    { name: "satkerUnitPengendaliKode", label: "Kode Pengendali" },
    { name: "satkerUnitKode", label: "Kode" },
    { name: "satkerUnitNama", label: "Nama" },
    { name: "satkerUnitDirektorat", label: "Direktorat" },
  ],
  initial: (item) => {
    if (!item) {
      return {
        satkerUnitPengendaliKode: "",
        satkerUnitKode: "",
        satkerUnitNama: "",
        satkerUnitDirektorat: "",
      };
    }
    return {
      satkerUnitPengendaliKode: item.satkerUnitPengendaliKode ?? "",
      satkerUnitKode: item.satkerUnitKode ?? "",
      satkerUnitNama: item.satkerUnitNama ?? "",
      satkerUnitDirektorat: item.satkerUnitDirektorat ?? "",
    };
  },
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id)) + 1,
    satkerUnitPengendaliKode: formData.satkerUnitPengendaliKode || "",
    satkerUnitKode: formData.satkerUnitKode || "",
    satkerUnitNama: formData.satkerUnitNama || "",
    satkerUnitDirektorat: formData.satkerUnitDirektorat || "",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
