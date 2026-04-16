import { ListChecks } from "lucide-react";

import type { PpkCode, SectionDef } from "./section-types";

export const ppkSection: SectionDef<PpkCode, "ppk"> = {
  id: "ppk",
  label: "PPK",
  icon: ListChecks,
  columns: ["ID", "Kode", "Nomenklatur", "Nama", "Jabatan", "Usulan"],
  pick: (x) =>
    [x.ppkKode, x.ppkNomenklatur, x.ppkNama, x.ppkJabatan]
      .filter(Boolean)
      .join(" "),
  toRow: (x) => [
    String(x.id),
    x.ppkKode,
    x.ppkNomenklatur,
    x.ppkNama ?? "",
    x.ppkJabatan ?? "",
    x.ppkUsulanMasuk ?? "",
  ],
  filters: [
    { name: "ppkKode", label: "Kode" },
    { name: "ppkNomenklatur", label: "Nomenklatur" },
    { name: "ppkNama", label: "Nama" },
    { name: "ppkJabatan", label: "Jabatan" },
  ],
  fields: [
    { name: "id", label: "ID", type: "number", readonly: true },
    { name: "ppkKode", label: "Kode" },
    { name: "ppkNomenklatur", label: "Nomenklatur" },
    { name: "ppkNama", label: "Nama PPK" },
    { name: "ppkJabatan", label: "Jabatan" },
    { name: "ppkUsulanMasuk", label: "Usulan Masuk (YYYY-MM-DD)", type: "date" },
  ],
  initial: (item) => {
    const empty: Record<string, string> = {
      id: "",
      ppkKode: "",
      ppkNomenklatur: "",
      ppkNama: "",
      ppkJabatan: "",
      ppkUsulanMasuk: "",
    };
    if (!item) return empty;
    return {
      id: String(item.id),
      ppkKode: item.ppkKode ?? "",
      ppkNomenklatur: item.ppkNomenklatur ?? "",
      ppkNama: item.ppkNama ?? "",
      ppkJabatan: item.ppkJabatan ?? "",
      ppkUsulanMasuk: item.ppkUsulanMasuk ?? "",
    };
  },
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id), 0) + 1,
    ppkKode: formData.ppkKode || "",
    ppkNomenklatur: formData.ppkNomenklatur || "",
    ppkNama: formData.ppkNama?.trim() || null,
    ppkJabatan: formData.ppkJabatan?.trim() || null,
    ppkUsulanMasuk: formData.ppkUsulanMasuk?.trim() || null,
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
