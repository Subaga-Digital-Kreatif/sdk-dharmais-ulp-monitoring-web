import { Layers3 } from "lucide-react";

import type { MakCode, MakKategori, SectionDef } from "./section-types";

const kategoriOptions = [
  { value: "Belanja Operasional", label: "Belanja Operasional" },
  { value: "Belanja Modal", label: "Belanja Modal" },
] as const;

export const makSection: SectionDef<MakCode, "mak"> = {
  id: "mak",
  label: "Kode MAK",
  icon: Layers3,
  columns: ["ID", "Kategori", "Kode", "Induk", "Rinci", "No"],
  pick: (x) => x.makRinci,
  toRow: (x) => [
    String(x.id),
    x.makKategori,
    x.makKode,
    x.makInduk,
    x.makRinci,
    x.makNo,
  ],
  filters: [
    {
      name: "makKategori",
      label: "Kategori",
      select: [...kategoriOptions],
    },
    { name: "makKode", label: "Kode" },
    { name: "makNo", label: "No" },
    { name: "makInduk", label: "Induk" },
  ],
  fields: [
    {
      name: "makKategori",
      label: "Kategori",
      select: [...kategoriOptions],
      allowEmpty: false,
    },
    { name: "makKode", label: "Kode" },
    { name: "makInduk", label: "Induk" },
    { name: "makRinci", label: "Rinci" },
    { name: "makNo", label: "No" },
    { name: "makKeterangan", label: "Keterangan", textarea: true },
  ],
  initial: (item) => {
    if (!item) {
      return {
        makKategori: "Belanja Operasional",
        makKode: "",
        makInduk: "",
        makRinci: "",
        makNo: "",
        makKeterangan: "",
      };
    }
    return {
      makKategori: item.makKategori ?? "",
      makKode: item.makKode ?? "",
      makInduk: item.makInduk ?? "",
      makRinci: item.makRinci ?? "",
      makNo: item.makNo ?? "",
      makKeterangan: item.makKeterangan ?? "",
    };
  },
  build: ({ formData, prev }) => ({
    id: prev?.id ?? 0,
    makKategori: (formData.makKategori as MakKategori) || "Belanja Operasional",
    makKode: formData.makKode || "",
    makInduk: formData.makInduk || "",
    makRinci: formData.makRinci || "",
    makNo: formData.makNo || "",
    makKeterangan: formData.makKeterangan || "",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
