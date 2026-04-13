import { Building2 } from "lucide-react";

import type { Perusahaan, SectionDef } from "./section-types";

export const perusahaanSection: SectionDef<Perusahaan, "perusahaan"> = {
  id: "perusahaan",
  label: "Perusahaan",
  icon: Building2,
  columns: [
    "ID",
    "Nama Perusahaan",
    "Pimpinan",
    "Kontak",
    "KBLI",
    "Alamat",
  ],
  pick: (x) =>
    [
      x.perusahaanNama,
      x.perusahaanPimpinanNama,
      x.perusahaanContact,
      x.perusahaanAlamat,
      x.perusahaanKbli,
    ]
      .filter((s) => s && String(s).trim())
      .join(" "),
  toRow: (x) => [
    String(x.id),
    x.perusahaanNama,
    x.perusahaanPimpinanNama,
    x.perusahaanContact,
    x.perusahaanKbli,
    x.perusahaanAlamat,
  ],
  filters: (items) => {
    const kblis = Array.from(
      new Set(
        items.map((x) => x.perusahaanKbli).filter((x) => x && x.trim()),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return [
      {
        name: "perusahaanKbli",
        label: "KBLI",
        select: kblis.map((k) => ({ value: k, label: k })),
      },
      { name: "perusahaanNama", label: "Nama Perusahaan" },
    ];
  },
  fields: [
    { name: "id", label: "ID", type: "number", readonly: true },
    { name: "perusahaanNama", label: "Nama Perusahaan" },
    { name: "perusahaanPimpinanNama", label: "Pimpinan" },
    { name: "perusahaanContact", label: "Kontak" },
    { name: "perusahaanKbli", label: "KBLI" },
    {
      name: "perusahaanAlamat",
      label: "Alamat",
      textarea: true,
      fullWidth: true,
    },
  ],
  initial: (item) => {
    const empty: Record<string, string> = {
      id: "",
      perusahaanNama: "",
      perusahaanPimpinanNama: "",
      perusahaanContact: "",
      perusahaanAlamat: "",
      perusahaanKbli: "",
    };
    if (!item) return empty;
    return {
      id: String(item.id),
      perusahaanNama: item.perusahaanNama ?? "",
      perusahaanPimpinanNama: item.perusahaanPimpinanNama ?? "",
      perusahaanContact: item.perusahaanContact ?? "",
      perusahaanAlamat: item.perusahaanAlamat ?? "",
      perusahaanKbli: item.perusahaanKbli ?? "",
    };
  },
  build: ({ formData, prev, items }) => ({
    id: prev?.id ?? Math.max(0, ...items.map((m) => m.id), 0) + 1,
    perusahaanNama: formData.perusahaanNama || "",
    perusahaanPimpinanNama: formData.perusahaanPimpinanNama || "",
    perusahaanContact: formData.perusahaanContact || "",
    perusahaanAlamat: formData.perusahaanAlamat || "",
    perusahaanKbli: formData.perusahaanKbli || "",
    createdAt: prev?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }),
};
