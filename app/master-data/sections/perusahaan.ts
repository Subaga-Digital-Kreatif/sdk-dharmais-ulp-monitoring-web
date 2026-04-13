import { Building2 } from "lucide-react";
import { toFlat } from "./utils";
import type { Perusahaan, SectionDef } from "./section-types";

export const perusahaanSection: SectionDef<Perusahaan, "perusahaan"> = {
  id: "perusahaan",
  label: "Perusahaan",
  icon: Building2,
  columns: ["Nama", "Pimpinan", "Kontak", "Alamat", "KBLI"],
  pick: (x) => x.perusahaan_nama,
  toRow: (x) => [
    x.perusahaan_nama,
    x.perusahaan_pimpinan_nama,
    x.perusahaan_contact,
    x.perusahaan_alamat,
    x.perusahaan_kbli,
  ],
  filters: (items) => {
    const kblis = Array.from(
      new Set(items.map((x) => x.perusahaan_kbli).filter((x) => x && x.trim()))
    ).sort((a, b) => a.localeCompare(b));

    return [
      {
        name: "perusahaan_kbli",
        label: "KBLI",
        select: kblis.map((k) => ({ value: k, label: k })),
      },
      { name: "perusahaan_nama", label: "Nama" },
    ];
  },
  fields: [
    { name: "perusahaan_nama", label: "Nama" },
    { name: "perusahaan_pimpinan_nama", label: "Pimpinan" },
    { name: "perusahaan_contact", label: "Kontak" },
    { name: "perusahaan_alamat", label: "Alamat", textarea: true },
    { name: "perusahaan_kbli", label: "KBLI" },
  ],
  initial: (item) => toFlat(item),
  build: ({ formData, prev }) => ({
    perusahaan_nama: formData.perusahaan_nama || "",
    perusahaan_pimpinan_nama: formData.perusahaan_pimpinan_nama || "",
    perusahaan_contact: formData.perusahaan_contact || "",
    perusahaan_alamat: formData.perusahaan_alamat || "",
    perusahaan_kbli: formData.perusahaan_kbli || "",
    created_at: prev?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }),
};
