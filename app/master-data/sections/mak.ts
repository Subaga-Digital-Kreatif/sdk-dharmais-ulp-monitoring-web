import { Layers3 } from "lucide-react";
import { toFlat } from "./utils";
import type { MakCode, MakKategori, SectionDef } from "./section-types";

export const makSection: SectionDef<MakCode, "mak"> = {
  id: "mak",
  label: "Kode MAK",
  icon: Layers3,
  columns: ["ID", "Kategori", "Kode", "Induk", "Rinci", "No"],
  pick: (x) => x.mak_rinci,
  toRow: (x) => [
    String(x.id),
    x.mak_kategori,
    x.mak_kode,
    x.mak_induk,
    x.mak_rinci,
    x.mak_no,
  ],
  filters: [
    {
      name: "mak_kategori",
      label: "Kategori",
      select: [
        { value: "Belanja Operasional", label: "Belanja Operasional" },
        { value: "Belanja Modal", label: "Belanja Modal" },
      ],
    },
    { name: "mak_kode", label: "Kode" },
    { name: "mak_no", label: "No" },
    { name: "mak_induk", label: "Induk" },
  ],
  fields: [
    {
      name: "mak_kategori",
      label: "Kategori",
      select: [
        { value: "Belanja Operasional", label: "Belanja Operasional" },
        { value: "Belanja Modal", label: "Belanja Modal" },
      ],
    },
    { name: "mak_kode", label: "Kode" },
    { name: "mak_induk", label: "Induk" },
    { name: "mak_rinci", label: "Rinci" },
    { name: "mak_no", label: "No" },
    { name: "mak_keterangan", label: "Keterangan", textarea: true },
  ],
  initial: (item) => toFlat(item),
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id)) + 1,
    mak_kategori: (formData.mak_kategori as MakKategori) || "Belanja Operasional",
    mak_kode: formData.mak_kode || "",
    mak_induk: formData.mak_induk || "",
    mak_rinci: formData.mak_rinci || "",
    mak_no: formData.mak_no || "",
    mak_keterangan: formData.mak_keterangan || "",
    created_at: prev?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }),
};
